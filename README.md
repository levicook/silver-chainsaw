# silver-chainsaw

Solana mini projects and experiments (personal learning and exploring)

## Projects (some are just ideas at the moment)
## 001-counter (done)

Demonstrates a global counter (each user shares a counter / global state)
- state lives in program account

### 002-counter (todo, skip?)

~ Demonstrates a "personal" counter (each user gets their own counter)
- state lives in a per-user account

### 003-proposals (wip)

~ Demonstrates a proposals program.

The ambitious version does stuff like this:

- Propose something to vote on
- Control when voting begins
- Control when voting closes
- Vote on open proposals
- Votes are Yes, No, Abstain
- Proposals lock-up funds
- Lock-up is returned if > 33% of token holders vote
  - Not sure if this query exists? ie: How many ppl hold this token??
  - Might have to approximate it by having token holders "register" to vote
- You have to hold a certain token to vote (program checks caller has balance > ??)

 ...but I might pare it back, because this is just a toy for learning.