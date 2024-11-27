package logger

import (
	"log"
	"net/http"
	"testing"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/sdk/metric"
)

func setupPrometheusExporter() {
	exporter, err := prometheus.New()
	if err != nil {
		log.Fatalf("failed to initialize prometheus exporter: %v", err)
	}

	meterProvider := metric.NewMeterProvider(metric.WithReader(exporter))
	otel.SetMeterProvider(meterProvider)

	// Expose metrics endpoint
	go func() {
		log.Println("Serving Prometheus metrics on :8080/metrics")
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()
}

func TestLogger(t *testing.T) {
	// Set up Prometheus exporter to log JAM events
	setupPrometheusExporter()

	// Initialize logger
	logger, err := NewOpenTelemetryLogger("jam", 2)
	if err != nil {
		panic(err)
	}
	// Log some CE events
	headerHash := "0x0cffbf67aae50aeed3c6f8f0d9bf7d854ffd87cef8358cbbaa587a9e3bd1a776"
        logger.BlockAnnouncementSent(1, headerHash)
        logger.BlockAnnouncementReceived(2, headerHash)

        logger.BlockRequestSent(3, headerHash)
        logger.BlockRequestReceived(4, headerHash)

        logger.StateRequestSent(5, "0xc0564c5e0de0942589df4343ad1956da66797240e2a2f2d6f8116b5047768986", "0xf6967658df626fa39cbfb6014b50196d23bc2cfbfa71a7591ca7715472dd2b48")
        logger.StateRequestReceived(4, "0x60751ab5b251361fbfd3ad5b0e84f051ccece6b00830aed31a5354e00b20b9ed", "0x9329de635d4bbb8c47cdccbbc1285e48bf9dbad365af44b205343e99dea298f3")

	ticketID := "0x7af11fdaa717c398e223211842b41392f18df4bbc4ea0f4cfb972f19c7a64949"
        logger.SafroleTicketDistributionSent(3, ticketID, true)
        logger.SafroleTicketDistributionReceived(2, ticketID, false)

	serviceID := uint32(16909060)
        logger.WorkPackageSubmissionSent(1, 101, ticketID)
        logger.WorkPackageSubmissionReceived(2, 102, ticketID)

	workPackageHash := "0x30466e0ae1b05dde5249872475f6beeac368fd014b5a3413ceb32d3872143284"
        logger.WorkPackageSharingSent(3, workPackageHash)
        logger.WorkPackageSharingReceived(4, workPackageHash)

        logger.AssuranceDistributionSent(5, headerHash)
        logger.AssuranceDistributionReceived(4, headerHash)

	preimageHash := "0xfa99b97e72fcfaef616108de981a59dc3310e2a9f5e73cd44d702ecaaccd8696"
        logger.PreimageAnnouncementSent(3, serviceID, preimageHash, 256)
        logger.PreimageAnnouncementReceived(2, serviceID, preimageHash, 256)

        logger.PreimageRequestSent(1, preimageHash)
        logger.PreimageRequestReceived(2, preimageHash)

        logger.AuditAnnouncementSent(3, headerHash, 0)
        logger.AuditAnnouncementReceived(4, headerHash, 1)

        logger.JudgmentPublicationSent(5, 303, true)
        logger.JudgmentPublicationReceived(6, 304, false)

	
	// Wait for metrics to be served
	time.Sleep(2 * time.Second)

	// Verify metrics endpoint is available
	resp, err := http.Get("http://localhost:8080/metrics")
	if err != nil {
		t.Fatalf("failed to access Prometheus metrics endpoint: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status OK from metrics endpoint, got: %v", resp.StatusCode)
	}

	t.Log("JAM logging via Prometheus...")
}

