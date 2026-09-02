package utils

import (
	"math"
	"strconv"
	"strings"
	"time"
)

func GenerateID(prefix string) string {
	return prefix + "_" + strings.ReplaceAll(time.Now().UTC().Format("20060102150405.000000"), ".", "") + GenerateRandSuffix(6)
}

func GenerateRandSuffix(length int) string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var sb strings.Builder
	seed := time.Now().UnixNano()
	for i := 0; i < length; i++ {
		sb.WriteByte(chars[seed%int64(len(chars))])
		seed = seed/7 + seed*3
	}
	return sb.String()
}

func TruncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}

func Slugify(s string) string {
	s = strings.ToLower(s)
	replacer := strings.NewReplacer(
		"á", "a", "é", "e", "í", "i", "ó", "o", "ú", "u",
		"ñ", "n", " ", "-",
	)
	s = replacer.Replace(s)
	return strings.Trim(s, "-")
}

// ===== Fechas =====

func FormatTime(t time.Time) string {
	return t.UTC().Format(time.RFC3339)
}

func ParseTime(s string) (time.Time, error) {
	return time.Parse(time.RFC3339, s)
}

func StartOfDay(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

func EndOfDay(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 23, 59, 59, 999999999, t.Location())
}

// ===== Números =====

func RoundTo(value float64, places int) float64 {
	mult := math.Pow(10, float64(places))
	return math.Round(value*mult) / mult
}

func FormatCOP(value float64) string {
	return "$ " + FormatWithSeparators(int64(math.Round(value)))
}

func FormatWithSeparators(value int64) string {
	str := strconv.FormatInt(value, 10)
	var sb strings.Builder
	count := 0
	for i := len(str) - 1; i >= 0; i-- {
		sb.WriteByte(str[i])
		count++
		if count == 3 && i > 0 {
			sb.WriteByte('.')
			count = 0
		}
	}
	runes := []rune(sb.String())
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

// ===== Validation helpers =====

func IsValidPage(p uint64) bool {
	return p > 0
}

func NormalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}