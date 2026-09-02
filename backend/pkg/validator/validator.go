package validator

import (
	"regexp"
	"strings"
	"unicode"
)

var (
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	nameRegex  = regexp.MustCompile(`^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$`)
	sanitizeRegex = regexp.MustCompile(`<[^>]*>|&lt;|&gt;|javascript:|on\w+=`)
)

func IsValidEmail(email string) bool {
	if len(email) > 254 {
		return false
	}
	return emailRegex.MatchString(email)
}

func IsValidPassword(password string) bool {
	if len(password) < 8 || len(password) > 72 {
		return false
	}

	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		case unicode.IsPunct(r) || unicode.IsSymbol(r):
			hasSpecial = true
		}
	}
	return hasUpper && hasLower && hasDigit && hasSpecial
}

func IsValidName(name string) bool {
	return nameRegex.MatchString(strings.TrimSpace(name))
}

func SanitizeInput(input string) string {
	// Remove HTML tags, inline event handlers, and script content
	clean := sanitizeRegex.ReplaceAllString(input, "")
	clean = strings.ReplaceAll(clean, "<script", "")
	clean = strings.ReplaceAll(clean, "</script>", "")
	clean = strings.TrimSpace(clean)
	return clean
}

func IsValidPhone(phone string) bool {
	if len(phone) < 7 || len(phone) > 20 {
		return false
	}
	phoneRegex := regexp.MustCompile(`^\+?[0-9\s\-\(\)]{7,20}$`)
	return phoneRegex.MatchString(phone)
}

func IsValidQuantity(q int) bool {
	return q >= 0
}

func IsValidPrice(p float64) bool {
	return p >= 0
}
