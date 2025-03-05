//go:build small
// +build small

package configs

const (
	Network                     = "small"
	TotalValidators             = 24 // V: The total number of validators.
	TotalCores                  = 8  // C: The total number of cores.
	TicketEntriesPerValidator   = 3  // N: The number of ticket entries per validator.
	EpochLength                 = 12 // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 10 // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 3  // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationQueueItems  = 80 // Q: The maximum number of items in the authorizations queue.
	MaxAuthorizationPoolItems   = 8  // O: The maximum number of items in the authorizations pool.
	ValidatorCoreRotationPeriod = 4  // R: The rotation period of validator-core assignments, in timeslots.
	SegmentSize                 = 4104
	ECPieceSize                 = 8
	NumECPiecesPerSegment       = 513
	PreimageExpiryPeriod        = 30
)
