package auth

import (
	"context"
	"errors"

	"github.com/zaro-group/backend/internal/config"
	"github.com/zaro-group/backend/internal/domain"
	"github.com/zaro-group/backend/internal/interfaces"
	"github.com/zaro-group/backend/internal/repositories"
	"github.com/zaro-group/backend/pkg/crypto"
	"github.com/zaro-group/backend/pkg/utils"
	"github.com/zaro-group/backend/pkg/validator"
)

var (
	ErrInvalidCredentials = errors.New("credenciales inválidas")
	ErrUserInactive       = errors.New("usuario inactivo")
	ErrPasswordTooWeak    = errors.New("la contraseña no cumple los requisitos mínimos")
	ErrEmailInvalid       = errors.New("email inválido")
)

type AuthUseCase struct {
	userRepo interfaces.UserRepository
	cfg      *config.Config
}

func NewAuthUseCase(userRepo interfaces.UserRepository, cfg *config.Config) *AuthUseCase {
	return &AuthUseCase{userRepo: userRepo, cfg: cfg}
}

type RegisterInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	AccessToken  string       `json:"access_token"`
	RefreshToken string       `json:"refresh_token"`
	TokenType    string       `json:"token_type"`
	ExpiresIn    int          `json:"expires_in"`
	User         *domain.User `json:"user"`
}

func (uc *AuthUseCase) Register(ctx context.Context, input RegisterInput) (*AuthResponse, error) {
	name := validator.SanitizeInput(input.Name)
	email := utils.NormalizeEmail(input.Email)

	if !validator.IsValidName(name) {
		return nil, ErrInvalidCredentials
	}
	if !validator.IsValidEmail(email) {
		return nil, ErrEmailInvalid
	}
	if !validator.IsValidPassword(input.Password) {
		return nil, ErrPasswordTooWeak
	}

	hash, err := crypto.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:           utils.GenerateID("usr"),
		Name:         name,
		Email:        email,
		PasswordHash: hash,
		Role:         string(domain.RoleFarmer),
	}

	if err := uc.userRepo.Create(ctx, user); err != nil {
		if errors.Is(err, repositories.ErrEmailInUse) {
			return nil, repositories.ErrEmailInUse
		}
		return nil, err
	}

	return uc.generateTokens(user)
}

func (uc *AuthUseCase) Login(ctx context.Context, input LoginInput) (*AuthResponse, error) {
	email := utils.NormalizeEmail(input.Email)

	if !validator.IsValidEmail(email) || input.Password == "" {
		return nil, ErrInvalidCredentials
	}

	user, err := uc.userRepo.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if !crypto.CheckPassword(user.PasswordHash, input.Password) {
		return nil, ErrInvalidCredentials
	}

	return uc.generateTokens(user)
}

func (uc *AuthUseCase) RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error) {
	claims, err := crypto.ParseJWT(refreshToken, uc.cfg.JWT.Secret)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if claims.Role != "refresh" {
		return nil, ErrInvalidCredentials
	}

	user, err := uc.userRepo.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	return uc.generateTokens(user)
}

func (uc *AuthUseCase) generateTokens(user *domain.User) (*AuthResponse, error) {
	accessToken, err := crypto.GenerateJWT(user.ID, user.Role, uc.cfg.JWT.Secret, uc.cfg.JWT.AccessExpiration)
	if err != nil {
		return nil, err
	}

	refreshToken, err := crypto.GenerateRefreshToken(user.ID, uc.cfg.JWT.Secret, uc.cfg.JWT.RefreshExpiration)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    uc.cfg.JWT.AccessExpiration * 3600,
		User:         user.Sanitize(),
	}, nil
}

func (uc *AuthUseCase) Logout(ctx context.Context, token string) error {
	// In a production system you'd add the token to a blacklist in Redis.
	// For simplicity, logout is immediate on the client side (token discarded).
	return nil
}