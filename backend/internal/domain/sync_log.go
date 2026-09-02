package domain

import "time"

type SyncStatus string

const (
	SyncPending    SyncStatus = "pending"
	SyncSynced     SyncStatus = "synced"
	SyncFailed     SyncStatus = "failed"
	SyncConflict   SyncStatus = "conflict"
)

type SyncOpType string

const (
	SyncOpCreate  SyncOpType = "create"
	SyncOpUpdate  SyncOpType = "update"
	SyncOpDelete  SyncOpType = "delete"
)

type SyncEntity string

const (
	SyncProduct SyncEntity = "product"
	SyncOrder   SyncEntity = "order"
)

type SyncLog struct {
	ID            string     `json:"id"`
	UserID        string     `json:"user_id"`
	EntityType    string     `json:"entity_type"`
	OperationType string     `json:"operation_type"`
	EntityID      string     `json:"entity_id"`
	Data          []byte     `json:"data"`
	Status        string     `json:"status"`
	Attempts      int        `json:"attempts"`
	LastAttempt   *time.Time `json:"last_attempt"`
	ClientVersion int        `json:"client_version"`
	ServerVersion int        `json:"server_version"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	DeletedAt     *time.Time `json:"deleted_at,omitempty"`
}

type SyncResult struct {
	LogsSynced     int              `json:"logs_synced"`
	Conflicts      []SyncConflict   `json:"conflicts"`
	SyncedItems    []SyncItemResult `json:"synced_items"`
}

type SyncConflict struct {
	EntityID    string `json:"entity_id"`
	EntityType  string `json:"entity_type"`
	ClientData  []byte `json:"client_data"`
	ServerData  []byte `json:"server_data"`
	Resolution  string `json:"resolution"`
}

type SyncItemResult struct {
	EntityID   string `json:"entity_id"`
	EntityType string `json:"entity_type"`
	Status     string `json:"status"`
	ServerVersion int `json:"server_version"`
}
