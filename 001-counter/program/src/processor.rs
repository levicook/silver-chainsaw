use crate::instruction::CounterInstruction;
use borsh::BorshDeserialize;
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match CounterInstruction::try_from_slice(instruction_data)? {
        CounterInstruction::Increment => process_increment(program_id, accounts, 1),
        CounterInstruction::IncrementBy { amount } => {
            process_increment(program_id, accounts, amount)
        }
        CounterInstruction::Decrement => process_decrement(program_id, accounts, 1),
        CounterInstruction::DecrementBy { amount } => {
            process_decrement(program_id, accounts, amount)
        }
    }
}

fn process_increment(program_id: &Pubkey, accounts: &[AccountInfo], amount: u16) -> ProgramResult {
    let _ = program_id;
    let _ = accounts;
    let _ = amount;
    todo!()
}

fn process_decrement(program_id: &Pubkey, accounts: &[AccountInfo], amount: u16) -> ProgramResult {
    let _ = program_id;
    let _ = accounts;
    let _ = amount;
    todo!()
}
