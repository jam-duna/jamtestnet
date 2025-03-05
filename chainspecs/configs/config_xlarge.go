//go:build xlarge
// +build xlarge

package configs

const (
	// xlarge testnet
	Network                     = "xlarge"
	TotalValidators             = 108 // V: The total number of validators.
	TotalCores                  = 36  // C: The total number of cores.
	TicketEntriesPerValidator   = 3   // N: The number of ticket entries per validator.
	EpochLength                 = 150 // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 125 // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 16  // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationQueueItems  = 80  // Q: The maximum number of items in the authorizations queue.
	MaxAuthorizationPoolItems   = 8   // O: The maximum number of items in the authorizations pool.
	ValidatorCoreRotationPeriod = 10  // R: The rotation period of validator-core assignments, in timeslots.
	SegmentSize                 = 4104
	ECPieceSize                 = 72
	NumECPiecesPerSegment       = 57
	PreimageExpiryPeriod        = 28800
)
