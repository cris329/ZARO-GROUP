package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/zaro-group/backend/internal/config"
	"github.com/zaro-group/backend/pkg/database"
	"github.com/zaro-group/backend/pkg/logger"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Error cargando configuración: %v", err)
	}

	logger.Init(cfg.App.LogLevel)

	db, err := database.NewMySQL(cfg)
	if err != nil {
		logger.Fatal("Error conectando a MySQL: %v", err)
	}
	defer db.Close()

	redisClient := database.NewRedis(cfg)
	if redisClient != nil {
		defer redisClient.Close()
	}

	server := &http.Server{
		Addr:         ":" + cfg.App.BackendPort,
		Handler:      setupRouter(cfg, db, redisClient),
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Info("Servidor iniciado en :"+cfg.App.BackendPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Error iniciando servidor: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Fatal("Error al apagar servidor: %v", err)
	}
	logger.Info("Servidor apagado correctamente")
}
