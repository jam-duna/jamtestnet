//go:build 2xlarge
// +build 2xlarge

package configs

const (
	// 2xlarge testnet : Tickets only
	Network                     = "2xlarge"
	TotalValidators             = 384 // V: The total number of validators.
	TotalCores                  = 128 // C: The total number of cores.
	TicketEntriesPerValidator   = 2   // N: The number of ticket entries per validator.
	EpochLength                 = 300 // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 250 // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 16  // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationQueueItems  = 80  // Q: The maximum number of items in the authorizations queue.
	MaxAuthorizationPoolItems   = 8   // O: The maximum number of items in the authorizations pool.
	ValidatorCoreRotationPeriod = 10  // R: The rotation period of validator-core assignments, in timeslots.
	SegmentSize                 = 4104
	ECPieceSize                 = 228
	NumECPiecesPerSegment       = 18
	PreimageExpiryPeriod        = 28800
)
