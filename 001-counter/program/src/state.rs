use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub struct Counter {
    pub value: u32,
}

impl Default for Counter {
    fn default() -> Self {
        Self { value: 0 }
    }
}

#[cfg(test)]
mod tests {
    use crate::state::Counter;
    use borsh::{BorshDeserialize, BorshSerialize};
    // use std::mem::size_of;

    #[test]
    fn test_counter_serialization() {
        let original = Counter::default();
        let encoded = original.try_to_vec().expect("Could not encode");
        let decoded = Counter::try_from_slice(&encoded).expect("Could not decode");
        assert_eq!(original, decoded);

        // println!("size_of Counter {}", size_of::<Counter>());
    }
}
