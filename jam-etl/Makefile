.PHONY: beauty dune_log bq_log

DUNE_LOADER := ./dune/dune_loader.sh

beauty:
	@echo "Beautifying JavaScript files with js-beautify..."
	@js-beautify dune/*.js *.js -r -s 4

dune_log:
	@echo "Converting StructuredLog to dune format..."
	@cd dune && node jam_to_dune.js

dune_load_dry: dune_log
	@echo "Dry-run dune loader..."
	@$(DUNE_LOADER) --dry-run

dune_load_run: dune_log
	@echo "Run dune loader..."
	@$(DUNE_LOADER) --run

dune_loader_only: 
	@echo "Run dune loader only..."
	@cd dune
	@$(DUNE_LOADER) --run

bq_log:
	@echo "Converting StructuredLog to BigQuery format..."
	@cd bq && node jam_to_bigquery.js