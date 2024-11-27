package logger

import (
	"context"
	"fmt"
	"time"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
	metricx "go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

type OpenTelemetryLogger struct {
	counters  map[string]metricx.Int64Counter
	validatorIndex uint16
}
func newResource() (*resource.Resource, error) {
	return resource.Merge(resource.Default(),
		resource.NewWithAttributes(semconv.SchemaURL,
			semconv.ServiceName("my-service"),
			semconv.ServiceVersion("0.1.0"),
		))
}

func newMeterProvider(res *resource.Resource) (*metric.MeterProvider, error) {
	metricExporter, err := stdoutmetric.New()
	if err != nil {
		return nil, err
	}

	meterProvider := metric.NewMeterProvider(
		metric.WithResource(res),
		metric.WithReader(metric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			metric.WithInterval(3*time.Second))),
	)
	return meterProvider, nil
}

func NewOpenTelemetryLogger(namespace string, validatorIndex uint16) (logger *OpenTelemetryLogger, err error) {
	// counter, ...  setup
	eventTypes := []string{
		"BlockAnnouncement", 
		"BlockRequest", 
		"StateRequest", 
		"SafroleTicketDistribution", 
		"WorkPackageSubmission",
		"WorkPackageSharing",
		"AssuranceDistribution", 
		"PreimageAnnouncement",
		"PreimageRequest", 
		"AuditAnnouncement",
		"JudgmentPublication",
	}

	logger = &OpenTelemetryLogger{
		validatorIndex: validatorIndex,
		counters:  make(map[string]metricx.Int64Counter),
	}
	res, err := newResource()
	if err != nil {
		panic(err)
	}

	meterProvider, err := newMeterProvider(res)
	if err != nil {
		panic(err)
	}
	otel.SetMeterProvider(meterProvider)
	
	meter := otel.GetMeterProvider().Meter(namespace)
	for _, eventType := range eventTypes {
		counterName := fmt.Sprintf("%sSent", eventType)
		counterSent, err := meter.Int64Counter(counterName, nil)
		if err != nil {
			panic(err)
		}
		logger.counters[counterName] = counterSent
		/*counterReceived, err := meter.Int64Counter(
			fmt.Sprintf("jamnp.%s.Sent", eventType),
			metric.WithDescription(fmt.Sprintf("%sSent", eventType)),
			metric.WithUnit("{call}"),
		)
		if err != nil {
			return 
		} */
	}
	return
}

// Generic log function
func (l *OpenTelemetryLogger) logSent(eventType string, receiver uint16, attributes map[string]interface{}) {
	// use counter -- TODO: incorporate receiver
	counterName := fmt.Sprintf("%sSent", eventType)
	counter, ok :=  l.counters[counterName]
	if ! ok {
		return
	}
	counter.Add(context.Background(), 1)
	/* 
	// TODO: Convert map[string]interface{} to OpenTelemetry attributes
	var otelAttributes []attribute.KeyValue
	for k, v := range attributes {
		otelAttributes = append(otelAttributes, attribute.String(k, fmt.Sprintf("%v", v)))
	}
	*/
}

func (l *OpenTelemetryLogger) logReceived(eventType string, sender uint16, attributes map[string]interface{}) {
	// use counter -- TODO: incorporate sender in the same way as above
	counterName := fmt.Sprintf("%sReceived", eventType)
	counter, ok :=  l.counters[counterName]
	if ! ok {
		return
	}
	counter.Add(context.Background(), 1)
	/* 
	// TODO: Convert map[string]interface{} to OpenTelemetry attributes
	var otelAttributes []attribute.KeyValue
	for k, v := range attributes {
		otelAttributes = append(otelAttributes, attribute.String(k, fmt.Sprintf("%v", v)))
	}
	*/
}


func (l *OpenTelemetryLogger) getTimestamp() string {
	// TODO: check what opentelemetry supports
	now := time.Now()
	return now.Format("2006-01-02 15:04:05.000000")

}

// UP 0: Block Announcement
func (l *OpenTelemetryLogger) BlockAnnouncementSent(receiver uint16, headerHash string) {
	l.logSent("BlockAnnouncementSent", receiver, map[string]interface{}{
		"headerHash":      headerHash,
	})
}

func (l *OpenTelemetryLogger) BlockAnnouncementReceived(sender uint16, headerHash string) {
	l.logReceived("BlockAnnouncementReceived", sender,  map[string]interface{}{
		"headerHash":      headerHash,
	})
}

// CE 128: Block Request
func (l *OpenTelemetryLogger) BlockRequestSent(receiver uint16, headerHash string) {
	l.logSent("BlockRequestSent", receiver, map[string]interface{}{
		"headerHash":  headerHash,
	})
}

func (l *OpenTelemetryLogger) BlockRequestReceived(sender uint16, headerHash string) {
	l.logReceived("BlockRequestSent", sender, map[string]interface{}{
		"headerHash":  headerHash,
	})
}

// CE 129: State Request
func (l *OpenTelemetryLogger) StateRequestSent(receiver uint16, startKey, endKey string) {
	l.logSent("StateRequest", receiver, map[string]interface{}{
		"startKey":      startKey,
		"endKey":      endKey,
	})
}

func (l *OpenTelemetryLogger) StateRequestReceived(sender uint16, startKey, endKey string) {
	l.logReceived("StateRequest", sender, map[string]interface{}{
		"startKey":      startKey,
		"endKey":      endKey,
	})
}

// CE 131/132: Safrole Ticket Distribution (132: proxy=true)
func (l *OpenTelemetryLogger) SafroleTicketDistributionSent(receiver uint16, ticketID string, proxy bool) {
	l.logSent("SafroleTicketDistribution", receiver, map[string]interface{}{
		"ticketID":  ticketID,
		"proxy":  proxy,
	})
}

func (l *OpenTelemetryLogger) SafroleTicketDistributionReceived(sender uint16, ticketID string, proxy bool) {
	l.logReceived("SafroleTicketDistribution", sender, map[string]interface{}{
		"ticketID":  ticketID,
		"proxy":  proxy,
	})
}

// CE 133: Work-Package Submission
func (l *OpenTelemetryLogger) WorkPackageSubmissionSent(receiver uint16, epoch int, ticketID string) {
	l.logSent("WorkPackageSubmission", receiver, map[string]interface{}{
		"epoch": epoch,
		"ticketID":     ticketID,
	})
}

func (l *OpenTelemetryLogger) WorkPackageSubmissionReceived(sender uint16, epoch int, ticketID string) {
	l.logReceived("WorkPackageSubmission", sender, map[string]interface{}{
		"epoch": epoch,
		"ticketID":     ticketID,
	})
}

// CE 134: Work-Package Sharing
func (l *OpenTelemetryLogger) WorkPackageSharingSent(receiver uint16, workPackageHash string) {
	l.logSent("WorkPackageSharing", receiver, map[string]interface{}{
		"workPackageHash": workPackageHash,
	})
}

func (l *OpenTelemetryLogger) WorkPackageSharingReceived(sender uint16, workPackageHash string) {
	l.logReceived("WorkPackageSharing", sender, map[string]interface{}{
		"workPackageHash": workPackageHash,
	})
}

// CE 141: Assurance Distribution
func (l *OpenTelemetryLogger) AssuranceDistributionSent(receiver uint16, headerHash string) {
	l.logSent("AssuranceDistribution", receiver, map[string]interface{}{
		"headerhash": headerHash,
	})
}

func (l *OpenTelemetryLogger) AssuranceDistributionReceived(sender uint16, headerHash string) {
	l.logReceived("AssuranceDistribution", sender, map[string]interface{}{
		"headerhash": headerHash,
	})
}

// CE 142: Preimage Announcement
func (l *OpenTelemetryLogger) PreimageAnnouncementSent(receiver uint16, serviceID uint32, hash string, length int) {
	l.logSent("PreimageAnnouncement", receiver, map[string]interface{}{
		"serviceID": serviceID,
		"hash": hash,
		"length": length,
	})
}

func (l *OpenTelemetryLogger) PreimageAnnouncementReceived(sender uint16, serviceID uint32, hash string, length int) {
	l.logReceived("PreimageAnnouncement", sender, map[string]interface{}{
		"serviceID": serviceID,
		"hash": hash,
		"length": length,
	})
}

// CE 143: Preimage Request
func (l *OpenTelemetryLogger) PreimageRequestSent(receiver uint16, preimageHash string) {
	l.logSent("PreimageRequest", receiver, map[string]interface{}{
		"h": preimageHash,
	})
}

func (l *OpenTelemetryLogger) PreimageRequestReceived(sender uint16, preimageHash string) {
	l.logReceived("PreimageRequest", sender, map[string]interface{}{
		"h": preimageHash,
	})
}

// CE 144: Audit Announcement
func (l *OpenTelemetryLogger) AuditAnnouncementSent(receiver uint16, headerHash string, tranche int) {
	l.logSent("AuditAnnouncement", receiver, map[string]interface{}{
		"headerhash": headerHash,
		"tranche": tranche,
	})
}

func (l *OpenTelemetryLogger) AuditAnnouncementReceived(sender uint16, headerHash string, tranche int) {
	l.logReceived("AuditAnnouncement", sender, map[string]interface{}{
		"headerhash": headerHash,
		"tranche": tranche,
	})
}

// CE 145: Judgment Publication
func (l *OpenTelemetryLogger) JudgmentPublicationSent(receiver uint16, epoch int, validity bool) {
	l.logSent("JudgmentPublication", receiver, map[string]interface{}{
		"epoch": epoch,
		"validity":   validity,
	})
}

func (l *OpenTelemetryLogger) JudgmentPublicationReceived(sender uint16, epoch int, validity bool) {
	l.logReceived("JudgmentPublication", sender, map[string]interface{}{
		"epoch": epoch,
		"validity":   validity,
	})
}
