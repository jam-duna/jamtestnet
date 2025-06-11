SHELL := bash

# Paths & parameters
CHAIN        := conf/polkajam-spec.json
PARAMS       := tiny
DATA_DIR     := jamtestnetdata
LOG_DIR      := logs
RPC_BASE     := 19800
QUIC_BASE    := 40000

JAVAJAM      := bin/javajam
POLKAJAM     := bin/polkajam
JAMDUNA      := bin/jamduna

# Validator sets
POLKAJAM_VALS := 0 1 2 3 4
JAMDUNA_VALS  := 5

.PHONY: jamtestnet prepare-dirs kill clean

jamtestnet: prepare-dirs
	@echo "→ Clearing old data and configs…"
	@rm -rf $(HOME)/.jamduna/jam-* $(DATA_DIR)
	@echo "→ Launching PolkaJAM validators ($(POLKAJAM_VALS))…"
	@for i in $(POLKAJAM_VALS); do \
	  RUST_LOG=polkavm=trace,jam_node=trace $(POLKAJAM) \
	    --chain $(CHAIN) \
	    --parameters $(PARAMS) run --temp \
	    --dev-validator $$i \
	    --rpc-port=$$(( $(RPC_BASE) + $$i )) \
	  >$(LOG_DIR)/polkajam-$$i.log 2>&1 & \
	done
	@echo "→ Launching JAMDuna validators ($(JAMDUNA_VALS))…"
	@for i in $(JAMDUNA_VALS); do \
	  $(JAMDUNA) run \
	    --chain $(CHAIN) \
	    --dev-validator $$i \
	    --rpc-port=$$(( $(RPC_BASE) + $$i )) \
	  >$(LOG_DIR)/jamduna-$$i.log 2>&1 & \
	done

prepare-dirs:
	@mkdir -p $(DATA_DIR) $(LOG_DIR)

kill:
	@echo "→ Stopping all JAM-related processes…"
	@pkill java || true
	@pkill jam  || true

clean: kill
	@echo "→ Removing data, logs, and local configs…"
	@rm -rf $(DATA_DIR) $(LOG_DIR) $(HOME)/.jamduna/jam-*
