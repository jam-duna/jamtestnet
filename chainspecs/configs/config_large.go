//go:build large
// +build large

package configs

const (
	// large testnet : Tickets only
	Network                     = "large"
	TotalValidators             = 96  // V: The total number of validators.
	TotalCores                  = 32  // C: The total number of cores.
	TicketEntriesPerValidator   = 2   // N: The number of ticket entries per validator.
	EpochLength                 = 120 // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 100 // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 8   // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationQueueItems  = 80  // Q: The maximum number of items in the authorizations queue.
	MaxAuthorizationPoolItems   = 8   // O: The maximum number of items in the authorizations pool.
	ValidatorCoreRotationPeriod = 4   // R: The rotation period of validator-core assignments, in timeslots.
	SegmentSize                 = 4104
	ECPieceSize                 = 24
	NumECPiecesPerSegment       = 171
	PreimageExpiryPeriod        = 30
)
