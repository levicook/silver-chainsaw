
check:
	@cargo check

clean:
	@cargo clean

build: # test
	@cargo build-bpf

# test:
# 	@cargo test-bpf

deploy: build
	@solana program deploy target/deploy/counter.so

program-id:
	@solana-keygen pubkey target/deploy/counter-keypair.json