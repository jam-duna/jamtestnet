//go:build medium
// +build medium

package configs

const (
	// Medium testnet : Tickets only
	Network                     = "medium"
	TotalValidators             = 48 // V: The total number of validators.
	TotalCores                  = 16 // C: The total number of cores.
	TicketEntriesPerValidator   = 6  // N: The number of ticket entries per validator.
	EpochLength                 = 60 // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 50 // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 3  // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationQueueItems  = 80 // Q: The maximum number of items in the authorizations queue.
	MaxAuthorizationPoolItems   = 8  // O: The maximum number of items in the authorizations pool.
	ValidatorCoreRotationPeriod = 4  // R: The rotation period of validator-core assignments, in timeslots.
	SegmentSize                 = 4104
	ECPieceSize                 = 12
	NumECPiecesPerSegment       = 342
	PreimageExpiryPeriod        = 30
)
