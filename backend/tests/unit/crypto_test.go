package crypto

import (
	"strings"
	"testing"
)

func TestHashPassword(t *testing.T) {
	password := "Abcdef1!"
	hash, err := HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword error: %v", err)
	}

	if !CheckPassword(hash, password) {
		t.Error("CheckPassword devolvió false para contraseña correcta")
	}

	if CheckPassword(hash, "OtroPass1!") {
		t.Error("CheckPassword devolvió true para contraseña incorrecta")
	}
}

func TestGenerateAndParseJWT(t *testing.T) {
	secret := strings.Repeat("a", 64)
	token, err := GenerateJWT("usr_123", "farmer", secret, 24)
	if err != nil {
		t.Fatalf("GenerateJWT error: %v", err)
	}

	claims, err := ParseJWT(token, secret)
	if err != nil {
		t.Fatalf("ParseJWT error: %v", err)
	}

	if claims.UserID != "usr_123" {
		t.Errorf("UserID = %q, want usr_123", claims.UserID)
	}
	if claims.Role != "farmer" {
		t.Errorf("Role = %q, want farmer", claims.Role)
	}

	if _, err := ParseJWT(token, strings.Repeat("b", 64)); err == nil {
		t.Error("ParseJWT aceptó firma incorrecta")
	}
}

func TestEncryptAES(t *testing.T) {
	key := []byte(strings.Repeat("k", 32))
	plain := "dato sensible del usuario"

	enc, err := EncryptAES(plain, key)
	if err != nil {
		t.Fatalf("EncryptAES error: %v", err)
	}

	dec, err := DecryptAES(enc, key)
	if err != nil {
		t.Fatalf("DecryptAES error: %v", err)
	}

	if dec != plain {
		t.Errorf("DecryptAES = %q, want %q", dec, plain)
	}

	// Wrong key must fail
	wrongKey := []byte(strings.Repeat("x", 32))
	if _, err := DecryptAES(enc, wrongKey); err == nil {
		t.Error("DecryptAES no falló con clave incorrecta")
	}
}

func TestSecureRandomString(t *testing.T) {
	a, err := SecureRandomString(32)
	if err != nil {
		t.Fatalf("SecureRandomString error: %v", err)
	}
	b, _ := SecureRandomString(32)
	if a == b {
		t.Error("dos llamadas devolvieron el mismo valor aleatorio")
	}
	if len(a) == 0 {
		t.Error("SecureRandomString devolvió cadena vacía")
	}
}