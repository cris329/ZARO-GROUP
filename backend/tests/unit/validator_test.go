package validator

import "testing"

func TestIsValidEmail(t *testing.T) {
	cases := []struct {
		email string
		want  bool
	}{
		{"test@example.com", true},
		{"juan.perez@campo.co", true},
		{"invalid-email", false},
		{"user@", false},
		{"@domain.com", false},
		{"user@domain", false},
	}
	for _, tc := range cases {
		if got := IsValidEmail(tc.email); got != tc.want {
			t.Errorf("IsValidEmail(%q) = %v, want %v", tc.email, got, tc.want)
		}
	}
}

func TestIsValidPassword(t *testing.T) {
	cases := []struct {
		password string
		want     bool
	}{
		{"Abcdef1!", true},
		{"abcdef1!", false}, // sin mayúscula
		{"ABCDEF1!", false}, // sin minúscula
		{"Abcdefg!", false}, // sin número
		{"Abcdef12", false}, // sin símbolo
		{"Ab1!", false},     // muy corta
	}
	for _, tc := range cases {
		if got := IsValidPassword(tc.password); got != tc.want {
			t.Errorf("IsValidPassword(%q) = %v, want %v", tc.password, got, tc.want)
		}
	}
}

func TestSanitizeInput(t *testing.T) {
	input := `<script>alert("xss")</script>Tomate`
	got := SanitizeInput(input)
	if got == input {
		t.Errorf("SanitizeInput no removió el script: %q", got)
	}
	if got != "Tomate" {
		t.Errorf("SanitizeInput = %q, want Tomate", got)
	}
}

func TestIsValidName(t *testing.T) {
	if !IsValidName("Juan Pérez") {
		t.Error("nombre válido rechazado")
	}
	if IsValidName("<script>") {
		t.Error("nombre con script aceptado")
	}
}