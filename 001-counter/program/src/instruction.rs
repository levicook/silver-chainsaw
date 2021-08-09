use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum CounterInstruction {
    // TODO(Levi): Initialize -- someone has to pay rent??

    /// Increments the counter by 1
    ///
    /// Accounts expected:
    /// 0. `[writeable]` The program account that holds counter state.
    /// 1. `[]` The rent sysvar.
    Increment,

    /// Increments the counter by user supplied amount.
    ///
    /// Accounts expected:
    /// 0. `[writeable]` The program account that holds counter state.
    /// 1. `[]` The rent sysvar.
    IncrementBy { amount: u16 },

    /// Decrements the counter by 1
    ///
    /// Accounts expected:
    /// 0. `[writeable]` The program account that holds counter state.
    /// 1. `[]` The rent sysvar.
    Decrement,

    /// Decrements the counter by user supplied amount.
    ///
    /// Accounts expected:
    /// 0. `[writeable]` The program account that holds counter state.
    /// 1. `[]` The rent sysvar.
    DecrementBy { amount: u16 },
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
        let original = CounterInstruction::IncrementBy { amount: 10 };
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = CounterInstruction::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);
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
        let original = CounterInstruction::DecrementBy { amount: 10 };
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = CounterInstruction::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);
    }
}
