pub enum CounterInstruction {
    /// Increments the counter by 1
    ///
    /// Accounts expected:
    /// 0. `[signer]` Account of the person incrementing the counter.
    Increment,

    /// Increments the counter by user supplied amount.
    ///
    /// Accounts expected:
    /// 0. `[signer]` Account of the person decrementing the counter.
    IncrementBy { amount: i64 },

    /// Decrements the counter by 1
    ///
    /// Accounts expected:
    /// 0. `[signer]` Account of the person decrementing the counter.
    Decrement,

    /// Decrements the counter by user supplied amount.
    ///
    /// Accounts expected:
    /// 0. `[signer]` Account of the person decrementing the counter.
    DecrementBy { amount: i64 },
}
