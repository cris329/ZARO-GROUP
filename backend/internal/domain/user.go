package domain

import "time"

type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleFarmer   UserRole = "farmer"
	RoleManager  UserRole = "manager"
)

func (u *User) IsValidRole() bool {
	switch u.Role {
	case string(RoleAdmin), string(RoleFarmer), string(RoleManager):
		return true
	}
	return false
}

func (u *User) Sanitize() *User {
	return &User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Role:      u.Role,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
