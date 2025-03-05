//go:build 3xlarge
// +build 3xlarge

package configs

const (
	// 3xlarge testnet : Tickets only
	Network                     = "3xlarge"
	TotalValidators             = 576 // V: The total number of validators.
	TotalCores                  = 192 // C: The total number of cores.
	TicketEntriesPerValidator   = 2   // N: The number of ticket entries per validator.
	EpochLength                 = 600 // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 500 // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 16  // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationQueueItems  = 80  // Q: The maximum number of items in the authorizations queue.
	MaxAuthorizationPoolItems   = 8   // O: The maximum number of items in the authorizations pool.
	ValidatorCoreRotationPeriod = 10  // R: The rotation period of validator-core assignments, in timeslots.
	SegmentSize                 = 4104
	ECPieceSize                 = 456
	NumECPiecesPerSegment       = 9
	PreimageExpiryPeriod        = 28800
)
