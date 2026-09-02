package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

const bcryptCost = 12

// ===== JWT =====

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func GenerateJWT(userID, role, secret string, expirationHours int) (string, error) {
	claims := &Claims{
		UserID: userID,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(expirationHours) * time.Hour).Unix(),
			IssuedAt:  time.Now().Unix(),
			Subject:   userID,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func GenerateRefreshToken(userID, secret string, expirationDays int) (string, error) {
	return GenerateJWT(userID, "refresh", secret, expirationDays*24)
}

func ParseJWT(tokenString, secret string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("token inválido")
	}
	return claims, nil
}

func ValidateToken(tokenString, secret string) (bool, error) {
	claims, err := ParseJWT(tokenString, secret)
	if err != nil {
		return false, err
	}
	return claims != nil, nil
}

// ===== Bcrypt =====

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func CheckPassword(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// ===== AES-256 =====

func EncryptAES(plaintext string, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func DecryptAES(encrypted string, key []byte) (string, error) {
	data, err := base64.StdEncoding.DecodeString(encrypted)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("texto cifrado inválido")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}
	return string(plaintext), nil
}

// ===== Secure Random =====

func SecureRandomString(length int) (string, error) {
	if length <= 0 {
		return "", errors.New("longitud debe ser positiva")
	}
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func SecureRandomBytes(length int) ([]byte, error) {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return nil, err
	}
	return b, nil
}

// ===== Derived Key (for mobile SQLite) =====
func DeriveKey(password string, salt []byte) ([]byte, error) {
	if len(salt) == 0 {
		salt = make([]byte, 16)
		if _, err := rand.Read(salt); err != nil {
			return nil, err
		}
	}
	derived := sha256.Sum256(append([]byte(password), salt...))
	return derived[:], nil
}

// ===== Constant time comparison =====
func SecureCompare(a, b string) bool {
	return subtle.ConstantTimeCompare([]byte(a), []byte(b)) == 1
}

// ===== Password strength meter =====
func PasswordStrength(password string) int {
	score := 0
	if len(password) >= 8 {
		score++
	}
	hasUpper := strings.ContainsFunc(password, func(r rune) bool {
		return r >= 'A' && r <= 'Z'
	})
	hasLower := strings.ContainsFunc(password, func(r rune) bool {
		return r >= 'a' && r <= 'z'
	})
	hasNumber := strings.ContainsFunc(password, func(r rune) bool {
		return r >= '0' && r <= '9'
	})
	if hasUpper && hasLower {
		score++
	}
	if hasNumber {
		score++
	}
	specialChars := "!@#$%^&*()_+-=[]{}|;:,.<>?"
	hasSpecial := strings.ContainsAny(password, specialChars)
	if hasSpecial {
		score++
	}
	return score
}
