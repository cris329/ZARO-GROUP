package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/omeblas/omeblas/backend/internal/config"
	"github.com/omeblas/omeblas/backend/pkg/database"
	"github.com/omeblas/omeblas/backend/pkg/logger"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Error cargando configuración: %v", err)
	}

	logger.Init(cfg.LogLevel)

	db, err := database.NewMySQL(cfg)
	if err != nil {
		logger.Fatalf("Error conectando a MySQL: %v", err)
	}
	defer db.Close()

	redisClient := database.NewRedis(cfg)
	if redisClient != nil {
		defer redisClient.Close()
	}

	server := &http.Server{
		Addr:         ":" + cfg.BackendPort,
		Handler:      setupRouter(cfg, db, redisClient),
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Infof("Servidor iniciado en :%s", cfg.BackendPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("Error iniciando servidor: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Fatalf("Error al apagar servidor: %v", err)
	}
	logger.Info("Servidor apagado correctamente")
}
