use crate::{error::CounterError, instruction::CounterInstruction, state::Counter};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = CounterInstruction::try_from_slice(instruction_data)?;

    let accounts_iter = &mut accounts.iter();

    let state_account = next_account_info(accounts_iter)?;

    let rent = Rent::get()?;
    if !rent.is_exempt(state_account.lamports(), state_account.data_len()) {
        msg!(
            "NotRentExempt: balance {} data_len {}",
            state_account.lamports(),
            state_account.data_len()
        );
        return Err(CounterError::NotRentExempt.into());
    }

    let mut counter = match Counter::try_from_slice(&state_account.data.borrow()) {
        Ok(counter) => counter,
        Err(err) => {
            msg!("Couldn't load the counter? {}", err);
            Counter::default()
        }
    };

    {
        // create scope for instruction matching (just so branches are one-liners)
        use crate::instruction::CounterInstruction::*;
        match instruction {
            Increment => process_increment(state_account, &mut counter, 1),
            IncrementBy { amount } => process_increment(state_account, &mut counter, amount),
            Decrement => process_decrement(state_account, &mut counter, 1),
            DecrementBy { amount } => process_decrement(state_account, &mut counter, amount),
            Reset => process_reset(state_account, &mut counter, 0),
            ResetTo { value } => process_reset(state_account, &mut counter, value),
        }
    }
}

fn process_increment(account: &AccountInfo, counter: &mut Counter, amount: u8) -> ProgramResult {
    msg!("process_increment ({} + {})", counter.value, amount);
    if let Some(new_value) = counter.value.checked_add(amount as u16) {
        counter.value = new_value;
    } else {
        return Err(CounterError::Overflow.into());
    }

    let writer = &mut &mut account.data.borrow_mut()[..];
    counter.serialize(writer)?;
    Ok(())
}

fn process_decrement(account: &AccountInfo, counter: &mut Counter, amount: u8) -> ProgramResult {
    msg!("process_decrement ({} - {})", counter.value, amount);
    if let Some(new_value) = counter.value.checked_sub(amount as u16) {
        counter.value = new_value;
    } else {
        return Err(CounterError::Underflow.into());
    }

    let writer = &mut &mut account.data.borrow_mut()[..];
    counter.serialize(writer)?;
    Ok(())
}

fn process_reset(account: &AccountInfo, counter: &mut Counter, value: u16) -> ProgramResult {
    msg!("process_reset from {} to {}", counter.value, value);
    counter.value = value;

    let writer = &mut &mut account.data.borrow_mut()[..];
    counter.serialize(writer)?;
    Ok(())
}
