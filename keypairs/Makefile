
all: alice-keypair.json \
	bob-keypair.json \
	counter-keypair.json \
	counter-state-keypair.json

alice-keypair.json:
	@solana-keygen new --outfile $@ --no-bip39-passphrase --silent
	@make airdrop-alice

bob-keypair.json:
	@solana-keygen new --outfile $@ --no-bip39-passphrase --silent

counter-keypair.json:
	@solana-keygen new --outfile $@ --no-bip39-passphrase --silent

counter-state-keypair.json:
	@solana-keygen new --outfile $@ --no-bip39-passphrase --silent
	@npm run ensure-program-state-account-ready --prefix ../001-counter/client

clean:
	@rm -fr *-keypair.json

airdrop-alice: alice-keypair.json
	@solana airdrop 10 alice-keypair.json

airdrop-bob: bob-keypair.json
	@solana airdrop 10 bob-keypair.json

balance-alice: alice-keypair.json
	@solana balance alice-keypair.json

balance-bob: bob-keypair.json
	@solana balance bob-keypair.json

pubkey-alice: alice-keypair.json
	@solana-keygen pubkey alice-keypair.json

pubkey-bob: bob-keypair.json
	@solana-keygen pubkey bob-keypair.json