use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum CounterInstruction {
    /// Increments the counter by 1
    ///
    /// Accounts expected:
    /// 0. `[writable]` Account that holds counter state.
    Increment,

    /// Increments the counter by user supplied amount.
    ///
    /// Accounts expected:
    /// 0. `[writable]` Account that holds counter state.
    IncrementBy { amount: u16 },

    /// Decrements the counter by 1
    ///
    /// Accounts expected:
    /// 0. `[writable]` Account that holds counter state.
    Decrement,

    /// Decrements the counter by user supplied amount.
    ///
    /// Accounts expected:
    /// 0. `[writable]` Account that holds counter state.
    DecrementBy { amount: u16 },
    //
    // TODO Reset
    // TODO ResetTo { value: u32 }
}

#[cfg(test)]
mod tests {
    use crate::instruction::CounterInstruction;
    use borsh::{BorshDeserialize, BorshSerialize};

    #[test]
    fn test_increment_serialization() {
        let original = CounterInstruction::Increment;
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = CounterInstruction::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);
    }

    #[test]
    fn test_increment_by_serialization() {
        let original = CounterInstruction::IncrementBy { amount: 65535 };
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = CounterInstruction::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);

        let ix = CounterInstruction::try_from_slice(&[1, 255, 255]).expect("Could not decode");
        assert_eq!(original, ix);
    }

    #[test]
    fn test_decrement_serialization() {
        let original = CounterInstruction::Decrement;
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = CounterInstruction::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);
    }

    #[test]
    fn test_decrement_by_serialization() {
        let original = CounterInstruction::DecrementBy { amount: 5 };
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = CounterInstruction::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);
    }
}
