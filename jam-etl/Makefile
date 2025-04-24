.PHONY: beauty dune_log bq_log

beauty:
	@echo "Beautifying JavaScript files with js-beautify..."
	@js-beautify dune/*.js *.js -r -s 4

dune_log:
	@echo "Converting StructuredLog to dune format..."
	@cd dune && node jam_to_dune.js

bq_log:
	@echo "Converting StructuredLog to BigQuery format..."
	@cd bq && node jam_to_bigquery.js