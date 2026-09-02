package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	MySQL  MySQLConfig
	Redis  RedisConfig
	JWT    JWTConfig
	App    AppConfig
	Security SecurityConfig
}

type MySQLConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Database string
}

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
	Enabled  bool
}

type JWTConfig struct {
	Secret            string
	AccessExpiration  int // horas
	RefreshExpiration int // días
}

type AppConfig struct {
	Env        string
	BackendPort string
	LogLevel   string
}

type SecurityConfig struct {
	CORSOrigins    []string
	RateLimit      int
	RateLimitBurst int
	EncryptionKey  string
}

func Load() (*Config, error) {
	cfg := &Config{}

	cfg.MySQL = MySQLConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "3306"),
		User:     getEnv("MYSQL_USER", "app_user"),
		Password: getEnv("MYSQL_PASSWORD", ""),
		Database: getEnv("MYSQL_DATABASE", "omeblas"),
	}

	cfg.Redis = RedisConfig{
		Addr:     getEnv("REDIS_ADDR", "localhost:6379"),
		Password: getEnv("REDIS_PASSWORD", ""),
		DB:       getEnvInt("REDIS_DB", 0),
		Enabled:  getEnvBool("REDIS_ENABLED", false),
	}

	cfg.JWT = JWTConfig{
		Secret:            getEnv("JWT_SECRET", ""),
		AccessExpiration:  getEnvInt("JWT_EXPIRATION_HOURS", 24),
		RefreshExpiration: getEnvInt("JWT_REFRESH_EXPIRATION_DAYS", 7),
	}

	if len(cfg.JWT.Secret) < 32 {
		return nil, fmt.Errorf("JWT_SECRET debe tener al menos 32 caracteres (256 bits)")
	}

	cfg.App = AppConfig{
		Env:         getEnv("APP_ENV", "development"),
		BackendPort: getEnv("BACKEND_PORT", "8080"),
		LogLevel:    getEnv("LOG_LEVEL", "debug"),
	}

	cfg.Security = SecurityConfig{
		CORSOrigins:    splitComma(getEnv("CORS_ORIGINS", "http://localhost:3000")),
		RateLimit:      getEnvInt("RATE_LIMIT", 100),
		RateLimitBurst: getEnvInt("RATE_LIMIT_BURST", 20),
		EncryptionKey:  getEnv("ENCRYPTION_KEY", ""),
	}

	if len(cfg.Security.EncryptionKey) != 32 {
		return nil, fmt.Errorf("ENCRYPTION_KEY debe tener exactamente 32 bytes para AES-256")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}

func splitComma(s string) []string {
	var result []string
	for _, part := range splitByComma(s) {
		if part != "" {
			result = append(result, part)
		}
	}
	return result
}

func splitByComma(s string) []string {
	var result []string
	current := ""
	for _, r := range s {
		if r == ',' {
			result = append(result, current)
			current = ""
		} else {
			current += string(r)
		}
	}
	if current != "" {
		result = append(result, current)
	}
	return result
}
