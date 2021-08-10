use crate::{error::CounterError, instruction::CounterInstruction, state::Counter};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    // rent::Rent,
    // sysvar::Sysvar,
};

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = CounterInstruction::try_from_slice(instruction_data)?;
    msg!("instruction {:?}", instruction);

    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    // let rent = &Rent::from_account_info(account)?;
    // if !rent.is_exempt(account.lamports(), account.data_len()) {
    //     return Err(CounterError::NotRentExempt.into());
    // }

    let mut counter = match Counter::try_from_slice(&account.data.borrow()) {
        Ok(counter) => counter,
        Err(_) => Counter::default(),
    };
    msg!("counter {:?}", counter);

    match instruction {
        CounterInstruction::Increment => process_increment(account, &mut counter, 1),
        CounterInstruction::IncrementBy { amount } => {
            process_increment(account, &mut counter, amount)
        }
        CounterInstruction::Decrement => process_decrement(account, &mut counter, 1),
        CounterInstruction::DecrementBy { amount } => {
            process_decrement(account, &mut counter, amount)
        }
    }
}

// fn process_increment(account: &AccountInfo, counter: &mut Counter, amount: u16) -> ProgramResult {
fn process_increment(account: &AccountInfo, counter: &mut Counter, amount: u16) -> ProgramResult {
    msg!("process_increment {:?} {:?}", counter, amount);
    if let Some(new_value) = counter.value.checked_add(amount as u32) {
        counter.value = new_value;
    } else {
        return Err(CounterError::Overflow.into())
    }

    let writer = &mut &mut account.data.borrow_mut()[..];
    counter.serialize(writer)?;
    Ok(())
}

fn process_decrement(account: &AccountInfo, counter: &mut Counter, amount: u16) -> ProgramResult {
    msg!("process_decrement {:?} {:?}", counter, amount);
    if let Some(new_value) = counter.value.checked_sub(amount as u32) {
        counter.value = new_value;
    } else {
        return Err(CounterError::Underflow.into());
    }

    let writer = &mut &mut account.data.borrow_mut()[..];
    counter.serialize(writer)?;
    Ok(())
}
