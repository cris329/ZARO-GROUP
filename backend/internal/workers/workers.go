package workers

import (
	"context"
	"time"

	"github.com/zaro-group/backend/pkg/logger"
)

type Worker interface {
	Name() string
	Run(ctx context.Context) error
}

type Scheduler struct {
	workers []Worker
	stopCh  chan struct{}
}

func NewScheduler() *Scheduler {
	return &Scheduler{
		stopCh: make(chan struct{}),
	}
}

func (s *Scheduler) Add(worker Worker) {
	s.workers = append(s.workers, worker)
}

func (s *Scheduler) Start(ctx context.Context) {
	for _, w := range s.workers {
		go s.runWorker(ctx, w)
	}
	logger.Info("Scheduler iniciado", "workers", len(s.workers))
}

func (s *Scheduler) Stop() {
	close(s.stopCh)
}

func (s *Scheduler) runWorker(ctx context.Context, w Worker) {
	for {
		select {
		case <-ctx.Done():
			logger.Info("Worker detenido", "name", w.Name())
			return
		case <-s.stopCh:
			return
		default:
		}

		err := w.Run(ctx)
		if err != nil {
			logger.Error("Worker error", "name", w.Name(), "error", err)
		}
		time.Sleep(time.Minute)
	}
}

type SyncWorker struct {
	interval time.Duration
}

func NewSyncWorker() *SyncWorker {
	return &SyncWorker{interval: time.Minute}
}

func (w *SyncWorker) Name() string {
	return "sync_processor"
}

func (w *SyncWorker) Run(ctx context.Context) error {
	logger.Debug("Procesando sincronizaciones asíncronas...")
	return nil
}

type ReportWorker struct{}

func NewReportWorker() *ReportWorker {
	return &ReportWorker{}
}

func (w *ReportWorker) Name() string {
	return "report_generator"
}

func (w *ReportWorker) Run(ctx context.Context) error {
	logger.Debug("Generando reportes programados...")
	return nil
}

type BackupWorker struct{}

func NewBackupWorker() *BackupWorker {
	return &BackupWorker{}
}

func (w *BackupWorker) Name() string {
	return "backup_scheduler"
}

func (w *BackupWorker) Run(ctx context.Context) error {
	logger.Debug("Ejecutando backup automático...")
	return nil
}