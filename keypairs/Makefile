
all: keypairs
	@make airdrop-alice
	@make airdrop-bob

keypairs: alice-keypair.json bob-keypair.json

alice-keypair.json:
	@solana-keygen new --outfile $@ --no-bip39-passphrase --silent

bob-keypair.json:
	@solana-keygen new --outfile $@ --no-bip39-passphrase --silent

clean:
	@rm -fr alice-keypair.json bob-keypair.json

airdrop-alice: keypairs
	@solana airdrop 10 alice-keypair.json

airdrop-bob: keypairs
	@solana airdrop 10 bob-keypair.json

balance-alice: keypairs
	@solana balance alice-keypair.json

balance-bob: keypairs
	@solana balance bob-keypair.json

pubkey-alice: keypairs
	@solana-keygen pubkey alice-keypair.json

pubkey-bob: keypairs
	@solana-keygen pubkey bob-keypair.json