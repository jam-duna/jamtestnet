JAM_PATH := $(CURDIR)
JAM_BIN := $(JAM_PATH)/jam
START_TIME := $(shell date -d "5 seconds" +"%Y-%m-%d %H:%M:%S")
NET_SPEC ?= tiny_with_metadata
PEER_LIST ?= ""
jam_clean:
	@echo "Cleaning all jam data directories under ~/.jam..."
	@rm -rf ${HOME}/.jam/jam-*
	@echo "Done."

# Run a single validator node
VALIDATOR_INDEX ?= 0
# Run a single validator node
run_node: jam_clean
	@echo "Starting node with validator index $(VALIDATOR_INDEX)..."
	$(JAM_BIN) run \
		--net_spec "$(NET_SPEC)" \
		--validator_index $(VALIDATOR_INDEX) \
		--start_time "$(START_TIME)" 

# Run multiple validator nodes in parallel using xargs
NUM_NODES ?= 6
run_many: jam_clean
	@echo "Starting $(NUM_NODES) validator nodes with net_spec=$(NET_SPEC)..."
	@START_TIME="$(START_TIME)"; \
	NET_SPEC="$(NET_SPEC)"; \
	PEER_LIST="$(PEER_LIST)"; \
	seq 0 $$(expr $(NUM_NODES) - 1) | \
	xargs -n 1 -P $(NUM_NODES) -I {} sh -c '\
		echo "Starting validator index={}"; \
		"$(JAM_BIN)" run \
			--net_spec "$$NET_SPEC" \
			--validator_index "{}" \
			--start_time "$$START_TIME" 
	'


