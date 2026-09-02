package main

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"

	"github.com/zaro-group/backend/internal/config"
	"github.com/zaro-group/backend/internal/handlers"
	"github.com/zaro-group/backend/internal/middleware"
	"github.com/zaro-group/backend/internal/repositories"
	"github.com/zaro-group/backend/internal/usecases/auth"
	"github.com/zaro-group/backend/internal/usecases/orders"
	"github.com/zaro-group/backend/internal/usecases/products"
	"github.com/zaro-group/backend/internal/usecases/reports"
	"github.com/zaro-group/backend/internal/usecases/sync"
)

func setupRouter(cfg *config.Config, db *sql.DB, redisClient *redis.Client) *gin.Engine {
	if cfg.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// ===== Global middlewares =====
	rateLimiter := middleware.NewRateLimiter(cfg.Security.RateLimit, cfg.Security.RateLimitBurst)
	rateLimiter.Cleanup(1 * time.Hour)

	router.Use(
		middleware.RequestID(),
		middleware.RequestLogger(),
		middleware.SecurityHeaders(),
		middleware.CORS(cfg.Security.CORSOrigins),
		middleware.Compression(),
		rateLimiter.Middleware(),
		middleware.PayloadLimit(10<<20), // 10MB
		middleware.Timeout(),
	)

	// ===== Repositories =====
	userRepo := repositories.NewUserRepository(db)
	productRepo := repositories.NewProductRepository(db)
	orderRepo := repositories.NewOrderRepository(db)
	syncLogRepo := repositories.NewSyncLogRepository(db)

	// ===== Use cases =====
	authUC := auth.NewAuthUseCase(userRepo, cfg)
	productUC := products.NewProductUseCase(productRepo, syncLogRepo)
	orderUC := orders.NewOrderUseCase(orderRepo)
	syncUC := sync.NewSyncUseCase(productRepo, orderRepo, syncLogRepo)
	reportUC := reports.NewReportUseCase(productRepo, orderRepo)

	// ===== Handlers =====
	authHandler := handlers.NewAuthHandler(authUC)
	productHandler := handlers.NewProductHandler(productUC)
	orderHandler := handlers.NewOrderHandler(orderUC)
	syncHandler := handlers.NewSyncHandler(syncUC)
	reportHandler := handlers.NewReportHandler(reportUC)

	// ===== Routes =====
	api := router.Group("/api/v1")

	// Health
	healthHandler := handlers.Health(func() error {
		return db.Ping()
	})
	router.GET("/health", healthHandler)
	router.GET("/live", handlers.Live())

	// Auth (public)
	api.POST("/auth/register", authHandler.Register)
	api.POST("/auth/login", authHandler.Login)
	api.POST("/auth/refresh", authHandler.RefreshToken)

	// ===== Protected routes =====
	protected := api.Group("")
	protected.Use(middleware.Auth(cfg.JWT.Secret))

	protected.POST("/auth/logout", authHandler.Logout)
	protected.GET("/auth/me", authHandler.Me)

	// Products
	productsGroup := protected.Group("/products")
	{
		productsGroup.GET("", productHandler.List)
		productsGroup.GET("/:id", productHandler.Get)
		productsGroup.POST("", productHandler.Create)
		productsGroup.PUT("/:id", productHandler.Update)
		productsGroup.DELETE("/:id", productHandler.Delete)
	}

	// Orders
	ordersGroup := protected.Group("/orders")
	{
		ordersGroup.GET("", orderHandler.List)
		ordersGroup.GET("/:id", orderHandler.Get)
		ordersGroup.POST("", orderHandler.Create)
		ordersGroup.PUT("/:id", orderHandler.Update)
		ordersGroup.DELETE("/:id", orderHandler.Delete)
	}

	// Sync
	syncGroup := protected.Group("/sync")
	{
		syncGroup.POST("/push", syncHandler.Push)
		syncGroup.GET("/pull", syncHandler.Pull)
		syncGroup.GET("/status", syncHandler.Status)
	}

	// Reports
	reportsGroup := protected.Group("/reports")
	{
		reportsGroup.GET("/inventory", reportHandler.Inventory)
		reportsGroup.GET("/sales", reportHandler.Sales)
		reportsGroup.GET("/inventory/export", reportHandler.ExportInventory)
		reportsGroup.GET("/sales/export", reportHandler.ExportSales)
	}

	// NotFound
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "not_found",
			"message": "ruta no encontrada",
			"status":  http.StatusNotFound,
		})
	})

	return router
}