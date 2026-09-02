package repositories

import (
	"context"
	"database/sql"
	"time"

	"github.com/omeblas/omeblas/backend/internal/domain"
)

type SyncLogRepository struct {
	db *sql.DB
}

func NewSyncLogRepository(db *sql.DB) *SyncLogRepository {
	return &SyncLogRepository{db: db}
}

func (r *SyncLogRepository) Create(ctx context.Context, log *domain.SyncLog) error {
	return r.createMany(ctx, []domain.SyncLog{*log})
}

func (r *SyncLogRepository) CreateMany(ctx context.Context, logs []domain.SyncLog) error {
	return r.createMany(ctx, logs)
}

func (r *SyncLogRepository) createMany(ctx context.Context, logs []domain.SyncLog) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `
		INSERT INTO sync_logs (id, user_id, entity_type, operation_type, entity_id, data, status, attempts, client_version, server_version, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	for _, log := range logs {
		now := time.Now().UTC()
		status := log.Status
		if status == "" {
			status = string(domain.SyncPending)
		}
		attempts := log.Attempts
		if attempts == 0 {
			attempts = 0
		}
		_, err := tx.ExecContext(ctx, query,
			log.ID, log.UserID, log.EntityType, log.OperationType, log.EntityID,
			log.Data, status, attempts, log.ClientVersion, log.ServerVersion,
			log.CreatedAt, log.UpdatedAt,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *SyncLogRepository) GetByID(ctx context.Context, id string) (*domain.SyncLog, error) {
	query := `
		SELECT id, user_id, entity_type, operation_type, entity_id, data, status, attempts, last_attempt, client_version, server_version, created_at, updated_at, deleted_at
		FROM sync_logs
		WHERE id = ? AND deleted_at IS NULL
	`

	log := &domain.SyncLog{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&log.ID, &log.UserID, &log.EntityType, &log.OperationType, &log.EntityID,
		&log.Data, &log.Status, &log.Attempts, &log.LastAttempt,
		&log.ClientVersion, &log.ServerVersion, &log.CreatedAt, &log.UpdatedAt, &log.DeletedAt,
	)
	if err == sql.ErrNoRows {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return log, nil
}

func (r *SyncLogRepository) GetByEntity(ctx context.Context, userID, entityType, entityID string) (*domain.SyncLog, error) {
	query := `
		SELECT id, user_id, entity_type, operation_type, entity_id, data, status, attempts, last_attempt, client_version, server_version, created_at, updated_at, deleted_at
		FROM sync_logs
		WHERE user_id = ? AND entity_type = ? AND entity_id = ? AND deleted_at IS NULL
		ORDER BY updated_at DESC
		LIMIT 1
	`

	log := &domain.SyncLog{}
	err := r.db.QueryRowContext(ctx, query, userID, entityType, entityID).Scan(
		&log.ID, &log.UserID, &log.EntityType, &log.OperationType, &log.EntityID,
		&log.Data, &log.Status, &log.Attempts, &log.LastAttempt,
		&log.ClientVersion, &log.ServerVersion, &log.CreatedAt, &log.UpdatedAt, &log.DeletedAt,
	)
	if err == sql.ErrNoRows {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return log, nil
}

func (r *SyncLogRepository) ListPendingByUser(ctx context.Context, userID string, limit int) ([]domain.SyncLog, error) {
	if limit < 1 {
		limit = 100
	}
	if limit > 500 {
		limit = 500
	}

	query := `
		SELECT id, user_id, entity_type, operation_type, entity_id, data, status, attempts, last_attempt, client_version, server_version, created_at, updated_at, deleted_at
		FROM sync_logs
		WHERE user_id = ? AND deleted_at IS NULL AND status = 'pending'
		ORDER BY created_at ASC
		LIMIT ?
	`

	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	rows, err := r.db.QueryContext(ctx, query, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []domain.SyncLog
	for rows.Next() {
		log := domain.SyncLog{}
		if err := rows.Scan(
			&log.ID, &log.UserID, &log.EntityType, &log.OperationType, &log.EntityID,
			&log.Data, &log.Status, &log.Attempts, &log.LastAttempt,
			&log.ClientVersion, &log.ServerVersion, &log.CreatedAt, &log.UpdatedAt, &log.DeletedAt,
		); err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}
	return logs, rows.Err()
}

func (r *SyncLogRepository) UpdateStatus(ctx context.Context, id, status string) error {
	query := `UPDATE sync_logs SET status = ?, updated_at = ? WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, status, time.Now().UTC(), id)
	return err
}

func (r *SyncLogRepository) Update(ctx context.Context, log *domain.SyncLog) error {
	query := `
		UPDATE sync_logs
		SET status = ?, data = ?, attempts = ?, last_attempt = ?,
			client_version = ?, server_version = ?, updated_at = ?
		WHERE id = ?
	`

	lastAttempt := log.LastAttempt
	if lastAttempt == nil {
		now := time.Now().UTC()
		lastAttempt = &now
	}

	_, err := r.db.ExecContext(ctx, query,
		log.Status, log.Data, log.Attempts, lastAttempt,
		log.ClientVersion, log.ServerVersion, time.Now().UTC(), log.ID,
	)
	return err
}

func (r *SyncLogRepository) IncrementAttempts(ctx context.Context, id string) error {
	query := `
		UPDATE sync_logs
		SET attempts = attempts + 1, last_attempt = ?, updated_at = ?
		WHERE id = ?
	`
	now := time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query, now, now, id)
	return err
}

func (r *SyncLogRepository) DeleteByID(ctx context.Context, id string) error {
	query := `UPDATE sync_logs SET deleted_at = ?, updated_at = ? WHERE id = ?`
	now := time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query, now, now, id)
	return err
}

func (r *SyncLogRepository) CountPending(ctx context.Context, userID string) (int64, error) {
	var count int64
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM sync_logs WHERE user_id = ? AND status = 'pending' AND deleted_at IS NULL`,
		userID,
	).Scan(&count)
	return count, err
}