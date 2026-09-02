package sync

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/omeblas/omeblas/backend/internal/domain"
	"github.com/omeblas/omeblas/backend/internal/interfaces"
	"github.com/omeblas/omeblas/backend/internal/repositories"
	"github.com/omeblas/omeblas/backend/pkg/utils"
	"github.com/omeblas/omeblas/backend/pkg/validator"
)

type SyncUseCase struct {
	productRepo interfaces.ProductRepository
	orderRepo   interfaces.OrderRepository
	syncRepo    interfaces.SyncLogRepository
}

func NewSyncUseCase(
	productRepo interfaces.ProductRepository,
	orderRepo interfaces.OrderRepository,
	syncRepo interfaces.SyncLogRepository,
) *SyncUseCase {
	return &SyncUseCase{productRepo: productRepo, orderRepo: orderRepo, syncRepo: syncRepo}
}

type SyncRequest struct {
	Logs      []SyncItem  `json:"logs"`
	DeviceID  string      `json:"device_id"`
	LastSync  *time.Time  `json:"last_sync"`
}

type SyncItem struct {
	EntityType    string          `json:"entity_type"`
	OperationType string          `json:"operation_type"`
	EntityID      string          `json:"entity_id"`
	Data          json.RawMessage `json:"data"`
	ClientVersion int             `json:"client_version"`
	Timestamp     time.Time       `json:"timestamp"`
}

type PushResult struct {
	Synced   []domain.SyncItemResult `json:"synced"`
	Conflicts         []OutConflict  `json:"conflicts"`
}

type OutConflict struct {
	EntityID   string `json:"entity_id"`
	EntityType string `json:"entity_type"`
	Resolution string `json:"resolution"`
}

func (uc *SyncUseCase) ProcessPush(ctx context.Context, userID string, req SyncRequest) (*domain.SyncResult, error) {
	result := &domain.SyncResult{}

	for _, item := range req.Logs {
		if err := validateSyncItem(item); err != nil {
			continue
		}

		switch domain.SyncEntity(item.EntityType) {
		case domain.SyncProduct:
			res := uc.processProduct(ctx, userID, item)
			result.SyncedItems = append(result.SyncedItems, res)
			if res.Status == string(domain.SyncConflict) {
				result.Conflicts = append(result.Conflicts, domain.SyncConflict{
					EntityID:   item.EntityID,
					EntityType: item.EntityType,
					Resolution: "server_wins",
				})
			}
		case domain.SyncOrder:
			res := uc.processOrder(ctx, userID, item)
			result.SyncedItems = append(result.SyncedItems, res)
			if res.Status == string(domain.SyncConflict) {
				result.Conflicts = append(result.Conflicts, domain.SyncConflict{
					EntityID:   item.EntityID,
					EntityType: item.EntityType,
					Resolution: "server_wins",
				})
			}
		default:
			continue
		}

		// Update/mark the sync log
		uc.updateSyncLog(ctx, userID, item)
	}

	result.LogsSynced = len(result.SyncedItems)
	return result, nil
}

func validateSyncItem(item SyncItem) error {
	if item.EntityID == "" || item.EntityType == "" || item.OperationType == "" {
		return errors.New("campos obligatorios faltantes")
	}
	if len(item.Data) == 0 {
		return errors.New("datos vacíos")
	}
	if item.ClientVersion < 1 {
		return errors.New("versión de cliente inválida")
	}
	return nil
}

func (uc *SyncUseCase) processProduct(ctx context.Context, userID string, item SyncItem) domain.SyncItemResult {
	// Check if product exists (in soft-deleted too) to detect conflict
	existing, err := uc.productRepo.GetByID(ctx, item.EntityID)
	if err == nil && existing != nil && existing.UserID == userID {
		// Conflict detection: if server version is newer than client's base version
		if existing.UpdatedAt.After(item.Timestamp) {
			return domain.SyncItemResult{
				EntityID:   item.EntityID,
				EntityType: string(domain.SyncProduct),
				Status:     string(domain.SyncConflict),
			}
		}

		// Update existing - last-writer-wins
		p := &domain.Product{}
		if err := json.Unmarshal(item.Data, p); err != nil {
			return domain.SyncItemResult{
				EntityID:   item.EntityID,
				EntityType: string(domain.SyncProduct),
				Status:     string(domain.SyncFailed),
			}
		}
		p.ID = existing.ID
		p.UserID = userID
		p.UpdatedAt = item.Timestamp
		p.Synced = true

		if err := uc.productRepo.UpdateForUser(ctx, userID, p); err != nil {
			return domain.SyncItemResult{
				EntityID:   item.EntityID,
				EntityType: string(domain.SyncProduct),
				Status:     string(domain.SyncFailed),
			}
		}
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncProduct),
			Status:     string(domain.SyncSynced),
		}
	}

	// Create new
	if item.OperationType == string(domain.SyncOpDelete) {
		// Delete op for a product we don't have - nothing to do
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncProduct),
			Status:     string(domain.SyncSynced),
		}
	}

	p := &domain.Product{}
	if err := json.Unmarshal(item.Data, p); err != nil {
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncProduct),
			Status:     string(domain.SyncFailed),
		}
	}

	p.ID = item.EntityID
	p.Name = validator.SanitizeInput(p.Name)
	p.Description = validator.SanitizeInput(p.Description)
	p.UserID = userID
	p.Synced = true
	p.CreatedAt = item.Timestamp
	p.UpdatedAt = item.Timestamp

	if err := uc.productRepo.Create(ctx, p); err != nil {
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncProduct),
			Status:     string(domain.SyncFailed),
		}
	}
	return domain.SyncItemResult{
		EntityID:   item.EntityID,
		EntityType: string(domain.SyncProduct),
		Status:     string(domain.SyncSynced),
	}
}

func (uc *SyncUseCase) processOrder(ctx context.Context, userID string, item SyncItem) domain.SyncItemResult {
	existing, err := uc.orderRepo.GetByID(ctx, item.EntityID)
	if err == nil && existing != nil && existing.UserID == userID {
		if existing.UpdatedAt.After(item.Timestamp) {
			return domain.SyncItemResult{
				EntityID:   item.EntityID,
				EntityType: string(domain.SyncOrder),
				Status:     string(domain.SyncConflict),
			}
		}

		o := &domain.Order{}
		if err := json.Unmarshal(item.Data, o); err != nil {
			return domain.SyncItemResult{
				EntityID:   item.EntityID,
				EntityType: string(domain.SyncOrder),
				Status:     string(domain.SyncFailed),
			}
		}
		o.ID = existing.ID
		o.UserID = userID
		o.Synced = true
		o.UpdatedAt = item.Timestamp

		if err := uc.orderRepo.UpdateForUser(ctx, userID, o); err != nil {
			return domain.SyncItemResult{
				EntityID:   item.EntityID,
				EntityType: string(domain.SyncOrder),
				Status:     string(domain.SyncFailed),
			}
		}
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncOrder),
			Status:     string(domain.SyncSynced),
		}
	}

	if item.OperationType == string(domain.SyncOpDelete) {
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncOrder),
			Status:     string(domain.SyncSynced),
		}
	}

	o := &domain.Order{}
	if err := json.Unmarshal(item.Data, o); err != nil {
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncOrder),
			Status:     string(domain.SyncFailed),
		}
	}

	o.ID = item.EntityID
	o.UserID = userID
	o.Synced = true
	o.Status = string(domain.OrderPending)
	o.CreatedAt = item.Timestamp
	o.UpdatedAt = item.Timestamp
	o.CalculateTotal()

	if err := uc.orderRepo.Create(ctx, o); err != nil {
		return domain.SyncItemResult{
			EntityID:   item.EntityID,
			EntityType: string(domain.SyncOrder),
			Status:     string(domain.SyncFailed),
		}
	}
	return domain.SyncItemResult{
		EntityID:   item.EntityID,
		EntityType: string(domain.SyncOrder),
		Status:     string(domain.SyncSynced),
	}
}

func (uc *SyncUseCase) updateSyncLog(ctx context.Context, userID string, item SyncItem) {
	log, err := uc.syncRepo.GetByEntity(ctx, userID, item.EntityType, item.EntityID)
	if err != nil {
		// Create log
		data, _ := json.Marshal(item.Data)
		now := time.Now().UTC()
		log = &domain.SyncLog{
			ID:            utils.GenerateID("syl"),
			UserID:        userID,
			EntityType:    item.EntityType,
			OperationType: item.OperationType,
			EntityID:      item.EntityID,
			Data:          data,
			Status:        string(domain.SyncSynced),
			ClientVersion: item.ClientVersion,
			ServerVersion: 1,
			CreatedAt:     now,
			UpdatedAt:     now,
		}
		_ = uc.syncRepo.Create(ctx, log)
		return
	}
	_ = uc.syncRepo.UpdateStatus(ctx, log.ID, string(domain.SyncSynced))
}