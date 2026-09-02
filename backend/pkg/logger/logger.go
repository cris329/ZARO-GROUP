package logger

import (
	"log"
	"os"
	"time"
)

var logger *log.Logger

func Init(level string) {
	flags := log.Ldate | log.Ltime | log.Lmicroseconds
	logger = log.New(os.Stdout, "", flags)
}

func Info(msg string, args ...interface{}) {
	if logger != nil {
		ts := time.Now().Format("2006-01-02 15:04:05.000")
		logger.Printf("%s [INFO] %s %v", ts, msg, args)
	}
}

func Warn(msg string, args ...interface{}) {
	if logger != nil {
		ts := time.Now().Format("2006-01-02 15:04:05.000")
		logger.Printf("%s [WARN] %s %v", ts, msg, args)
	}
}

func Error(msg string, args ...interface{}) {
	if logger != nil {
		ts := time.Now().Format("2006-01-02 15:04:05.000")
		logger.Printf("%s [ERROR] %s %v", ts, msg, args)
	}
}

func Debug(msg string, args ...interface{}) {
	if logger != nil {
		ts := time.Now().Format("2006-01-02 15:04:05.000")
		logger.Printf("%s [DEBUG] %s %v", ts, msg, args)
	}
}

func Fatal(msg string, args ...interface{}) {
	if logger != nil {
		ts := time.Now().Format("2006-01-02 15:04:05.000")
		logger.Printf("%s [FATAL] %s %v", ts, msg, args)
	}
	os.Exit(1)
}
