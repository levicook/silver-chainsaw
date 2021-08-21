# silver-chainsaw

Solana mini projects and experiments (personal learning and exploring)

## Projects (some are just ideas at the moment)
## 001-counter (done)

Demonstrates a global counter (each user shares a counter / global state)
- state lives in program account

### 002-governance

Explores usage of the [solana-program-library governance program](https://github.com/solana-labs/solana-program-library/tree/master/governance).

<!-- 
### 002-splits (wip)

The basic idea is it routes funds continuously to an unlimited number of
addresses, according to a set of percentage allocations.

The winning bids from these three auctions will be split amongst
the musicians, visual artists, project operatives, and Songcamp’s
treasury. We are using Mirror’s Splits tool in order to
instantaneously and trustlessly split all auction proceeds to their
rightful recipient. To see this breakdown in action, scroll down to
the Split blocks below. " how do the winning bids work exactly? Is it
something like top 10 bids get a share of the upside?

### 003-proposals (todo)

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

Good advice from the Solana Discord:

You might want to checkout the governance program at https://github.com/solana-labs/solana-program-library/tree/master/governance for ideas.
There's also the feature proposal program that is a little lighter-weight but similar: https://spl.solana.com/feature-proposal

## Project Ideas

Stuff I'm not planning to build, but found interesting to think about.

https://discord.com/channels/428295358100013066/517163444747894795/874877235524407358

Useful contract idea: splits.

So for example me and a friend instantiate a 50 / 50 split contract. When money is sent to the contract, half is sent to my friend and half is sent to me.

Bounty only the owner can claim?
https://twitter.com/bryce/status/1425673906501738497?s=20

-->