OUTPUT_DIR := .
BINARY := jamtestnet
SRC := jamtestnet.go

jamtestnet:
	@echo "Building jamtestnet..."
	mkdir -p $(OUTPUT_DIR)
	go build -o $(OUTPUT_DIR)/$(BINARY) $(SRC)
	@echo "Checking formatting..."

spawn:
	${BINARY} --config=./tiny.toml --delay=12

clean:
	rm -f $(OUTPUT_DIR)/$(BINARY)

beauty:
	@echo "Running go fmt on all Go files..."
	@go fmt ./...

fmt-check:
	@echo "Checking formatting..."
	@diff -u <(echo -n) <(gofmt -d .)

## SAMPLE TEAM [WIP]
jam-duna:
	wget https://cdn.colorfulnotion.com/jam-duna/jam -o bin/jam-duna/jam

## OTHER TEAMS - submit PR with a Makefile update and a .gitignore 
yourteam:
	wget https://yourteam.org/bin/jam -o bin/yourteam/jam

blockcowboys:
	#wget https://yourteam.org/bin/jam -o bin/blockcowboys/jam
boka:
	#wget https://yourteam.org/bin/jam -o bin/boka/jam
clawbird:
	#wget https://yourteam.org/bin/jam -o bin/clawbird/jam
gossamer:
	#wget https://yourteam.org/bin/jam -o bin/gossamer/jam
graymatter:
	#wget https://yourteam.org/bin/jam -o bin/graymatter/jam
jam-forge:
	#wget https://yourteam.org/bin/jam -o bin/jam-forge/jam
jamlabs:
	#wget https://yourteam.org/bin/jam -o bin/jamlabs/jam
jam-with-zig:
	#wget https://yourteam.org/bin/jam -o bin/jam-with-zig/jam
jam4s:
	#wget https://yourteam.org/bin/jam -o bin/jam4s/jam
jamzig:
	#wget https://yourteam.org/bin/jam -o bin/jamzig/jam
jamaica:
	#wget https://yourteam.org/bin/jam -o bin/jamaica/jam
jamgo:
	#wget https://yourteam.org/bin/jam -o bin/jamgo/jam
jamixir:
	#wget https://yourteam.org/bin/jam -o bin/jamixir/jam
jampy:
	#wget https://yourteam.org/bin/jam -o bin/jampy/jam
javajam:
	#wget https://yourteam.org/bin/jam -o bin/javajam/jam
jelly:
	#wget https://yourteam.org/bin/jam -o bin/jelly/jam
morum:
	#wget https://yourteam.org/bin/jam -o bin/morum/jam
marmalade:
	#wget https://yourteam.org/bin/jam -o bin/marmalade/jam
po-jam-l:
	#wget https://yourteam.org/bin/jam -o bin/po-jam-l/jam
polkajam:
	#wget https://yourteam.org/bin/jam -o bin/polkajam/jam
pyjamaz:
	#wget https://yourteam.org/bin/jam -o bin/pyjamaz/jam
rjam:
	#wget https://yourteam.org/bin/jam -o bin/rjam/jam
strawberry:
	#wget https://yourteam.org/bin/jam -o bin/strawberry/jam
tsjam:
	#wget https://yourteam.org/bin/jam -o bin/tsjam/jam
tessera:
	#wget https://yourteam.org/bin/jam -o bin/tessera/jam
typeberry:
	#wget https://yourteam.org/bin/jam -o bin/typeberry/jam
universaldot:
	#wget https://yourteam.org/bin/jam -o bin/universaldot/jam
vinwolf:
	#wget https://yourteam.org/bin/jam -o bin/vinwolf/jam
goberryjam:
	#wget https://yourteam.org/bin/jam -o bin/goberryjam/jam
subjam:
	#wget https://yourteam.org/bin/jam -o bin/subjam/jam


