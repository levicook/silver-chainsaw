use num_derive::FromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    msg,
    program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

#[derive(Clone, Copy, Debug, Error, FromPrimitive)]
pub enum CounterError {
    #[error("Not Rent Exempt")]
    NotRentExempt,

    #[error("Overflow Error")]
    Overflow,

    #[error("Underflow Error")]
    Underflow,
}

impl From<CounterError> for ProgramError {
    fn from(e: CounterError) -> ProgramError {
        ProgramError::Custom(e as u32)
    }
}

impl PrintProgramError for CounterError {
    fn print<E>(&self) {
        msg!(&self.to_string());
    }
}

impl<T> DecodeError<T> for CounterError {
    fn type_of() -> &'static str {
        "CounterError"
    }
}
