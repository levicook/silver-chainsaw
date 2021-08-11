
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
     `npm run --prefix=001-counter/client increment_by 1000`

   - Decrement the on-chain counter by 1 with \
     `npm run --prefix=001-counter/client increment`

   - Decrement the on-chain counter by an arbitrary amount \
     `npm run --prefix=001-counter/client decrement_by 1000`

   - You can observe the counter by looking at your validator logs. eg:
     > Program log: process_increment (0 + 1)

   - You can also observe the counter by looking at client logs. \
     Full example below:

```bash
npm run --prefix=001-counter/client increment

> client@0.1.0 increment
> ts-node src/main.ts increment

Transaction 5kBbQ13CZypDyTT4cpvFNxdm76eUYoGKypJqaSmrJLjfnn7RncdRFDmDq16nWieisNJHLGaNRc3fEV1VfcS6EyeA {
  blockTime: 1628650342,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      'Program RpxrTE3rPxoPT5WnDoAENzB8inYkJTDxnVhbLKyiBv9 invoke [1]',
      'Program log: process_increment (4 + 1)',
      'Program RpxrTE3rPxoPT5WnDoAENzB8inYkJTDxnVhbLKyiBv9 consumed 2440 of 200000 compute units',
      'Program RpxrTE3rPxoPT5WnDoAENzB8inYkJTDxnVhbLKyiBv9 success'
    ],
    postBalances: [ 9999046280, 918720, 1009200, 1141440 ],
    postTokenBalances: [],
    preBalances: [ 9999051280, 918720, 1009200, 1141440 ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null }
  },
  slot: 2959,
  transaction: {
    message: Message {
      header: [Object],
      accountKeys: [Array],
      recentBlockhash: 'D5jwHv6j27zainXsKss8YNaBWS6NVXKGAk1Uoh6YPYM7',
      instructions: [Array]
    },
    signatures: [
      '5kBbQ13CZypDyTT4cpvFNxdm76eUYoGKypJqaSmrJLjfnn7RncdRFDmDq16nWieisNJHLGaNRc3fEV1VfcS6EyeA'
    ]
  }
}
```
