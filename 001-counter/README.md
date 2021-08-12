
# counter

This project implements an on-chain counter and consists of two software components.

1. client - a command line application, written in Typescript
1. program - a Solana program, written in Rust

## How do I work this thing?

The short version; assumes familiarity with solana dev tools:

### Run a validator on localhost

I find it helpful to run the validator with verbose logging, piped through grep to reduce noise.
Specifically, I rely on:

```bash
export RUST_LOG=solana_runtime::system_instruction_processor=trace,solana_runtime::message_processor=debug,solana_bpf_loader=debug,solana_rbpf=debug`
solana-test-validator --log 2>&1 | grep -v Vote111111111111111111111111111111111111111
```

### Clone, build and run the project

Before exploring _how_ the client and program are implemented, I
recommend getting a feel for how it's used.

1. Fire up a terminal

1. Clone the project && `cd` into it

1. Generate keypairs for testing with:

   - `make all --directory=keypairs`

   - note: this assumes you have `solana` installed

   - note: it also assumes you have run \
     `solana config set --url http://localhost:8899`

1. Compile and deploy the on-chain program with:

   - `make deploy --directory=001-counter/program`

   - note: this generates keypairs if you skipped that step

   - note: depending on hardware, this can take a while

1. Run the client

   - Fund alice by running \
     `make airdrop-alice --directory=keypairs`

   - note: we fund alice because they're the keypair signing and sending
     transactions to the Solana chain.

   - If you forget to fund alice, you'll see something like this
     > Attempt to debit an account but found no record of a prior credit.

   - Sometimes the program's state account isn't properly funded on time. Just re-run the client / transaction if you see this
     > Program log: Not Rent Exempt

   - Increment the on-chain counter by 1 with \
     `npm run --prefix=001-counter/client increment`

   - Increment the on-chain counter by an arbitrary amount \
     `npm run --prefix=001-counter/client increment-by 10`

   - Decrement the on-chain counter by 1 with \
     `npm run --prefix=001-counter/client decrement`

   - Decrement the on-chain counter by an arbitrary amount \
     `npm run --prefix=001-counter/client decrement-by 10`

   - Reset the on-chain counter to 0 with \
     `npm run --prefix=001-counter/client reset`

   - Reset the on-chain counter by an arbitrary value with \
     `npm run --prefix=001-counter/client reset-to 20`

   - You can observe the counter by looking at your validator logs. eg:
     > Program log: process_increment (0 + 1)

   - increment-by and increment-by accept 8 bit numbers (0 through 255) \
     and reset-to accept 16 bit numbers (0 through 65,535).

     - transactions that exceed these ranges will fail

     - some range errors can be detected by borsh-js on the client-side

     - running `reset-to 65536` will produce the following log output:
       > RangeError [ERR_OUT_OF_RANGE]: The value of "value" is out of range. It must be >= 0 and <= 65535. Received 65536

     - others can't be detected until you're on chain / in Rust

     - running `reset` followed by an `decrement 1`
       should produce the following log output:
       > 'Program log: process_decrement (0 - 1)', \
       > 'Program log: Underflow Error',

     - try running `reset-to 65536` followed by an `increment 1`
       should produce the following log output:
       > 'Program log: process_increment (65535 + 1)', \
       > 'Program log: Overflow Error',

NOTE: Arithmetic underflow and overflow are common sources of security
vulnerabilities and the main reaons I wanted to explore this "toy"
program. Happy to see that Borsh and Rust do an _excellent_ job here.

