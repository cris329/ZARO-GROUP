package e2e

import (
	"net/http"
	"testing"
)

// Pruebas end-to-end contra la API completa.
// Requieren la API corriendo en http://localhost:8080

const baseURL = "http://localhost:8080/api/v1"

func TestHealthEndpoint(t *testing.T) {
	resp, err := http.Get(baseURL[:strings_Index(baseURL, "/api")] + "/health")
	if err != nil {
		t.Skip("API no disponible:", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("health status = %d, want 200", resp.StatusCode)
	}
}

func strings_Index(s, sub string) int {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return i
		}
	}
	return -1
}