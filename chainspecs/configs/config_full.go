//go:build full
// +build full

package configs

const (
	// Full testnet : Tickets only
	Network                     = "full"
	TotalValidators             = 1023 // V: The total number of validators.
	TotalCores                  = 341  // C: The total number of cores.
	TicketEntriesPerValidator   = 2    // N: The number of ticket entries per validator.
	EpochLength                 = 600  // E: The length of an epoch in timeslots.
	TicketSubmissionEndSlot     = 500  // Y: The number of slots into an epoch at which ticket-submission ends.
	MaxTicketsPerExtrinsic      = 16   // K: The maximum number of tickets which may be submitted in a single extrinsic.
	MaxAuthorizationPoolItems   = 8    // O: The maximum number of items in the authorizations pool.
	MaxAuthorizationQueueItems  = 80   // Q: The maximum number of items in the authorizations queue.
	ValidatorCoreRotationPeriod = 10   // R: The rotation period of validator-core assignments, in timeslots.
)
