package services

import (
	"context"
	"errors"
	"time"

	"github.com/zaro-group/backend/pkg/logger"
)

type EmailService interface {
	Send(ctx context.Context, to, subject, body string) error
}

type MockEmailService struct {
	enabled bool
}

func NewMockEmailService(enabled bool) *MockEmailService {
	return &MockEmailService{enabled: enabled}
}

func (s *MockEmailService) Send(ctx context.Context, to, subject, body string) error {
	if !s.enabled {
		return nil
	}
	logger.Info("Email enviado", "to", to, "subject", subject)
	return nil
}

type SMSService interface {
	Send(ctx context.Context, phone, message string) error
}

type MockSMSService struct {
	enabled bool
}

func NewMockSMSService(enabled bool) *MockSMSService {
	return &MockSMSService{enabled: enabled}
}

func (s *MockSMSService) Send(ctx context.Context, phone, message string) error {
	if !s.enabled {
		return nil
	}
	logger.Info("SMS enviado", "phone", phone, "message", message)
	return nil
}

type NotificationService interface {
	Notify(ctx context.Context, userID, title, body string) error
}

type NotificationServiceMock struct {
	email EmailService
	sms   SMSService
}

func NewNotificationService(email EmailService, sms SMSService) *NotificationServiceMock {
	return &NotificationServiceMock{email: email, sms: sms}
}

func (s *NotificationServiceMock) Notify(ctx context.Context, userID, title, body string) error {
	if userID == "" {
		return errors.New("user_id requerido")
	}
	_ = s.email.Send(ctx, userID+"@zarogroup.local", title, body)
	return nil
}

type RetryPolicy struct {
	MaxRetries    int
	Backoff       time.Duration
	BackoffFactor float64
}

func DefaultRetryPolicy() RetryPolicy {
	return RetryPolicy{
		MaxRetries:    5,
		Backoff:       time.Second,
		BackoffFactor: 2.0,
	}
}

func WithRetry(retryPolicy RetryPolicy, fn func() error) error {
	var err error
	current := retryPolicy.Backoff
	for attempt := 0; attempt <= retryPolicy.MaxRetries; attempt++ {
		err = fn()
		if err == nil {
			return nil
		}
		select {
		case <-time.After(current):
		}
		current = time.Duration(float64(current) * retryPolicy.BackoffFactor)
		if current > 30*time.Second {
			current = 30 * time.Second
		}
	}
	return err
}