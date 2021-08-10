
check:
	@cargo check

clean:
	@make -C ../../keypairs --silent clean
	@cargo clean

build: test
	@cargo build-bpf

test:
	@cargo test

deploy: build
	@make -C ../../keypairs --silent all
	@solana program deploy target/deploy/counter.so --program-id ../../keypairs/counter-keypair.json