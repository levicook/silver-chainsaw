import { Enum, SOLANA_SCHEMA, Struct } from "@solana/web3.js";

class Increment extends Struct { }

class IncrementBy extends Struct { }

class Decrement extends Struct { }

class DecrementBy extends Struct { }

class Reset extends Struct { }

class ResetTo extends Struct { }

export class CounterInstruction extends Enum {
    static increment(): CounterInstruction {
        return new CounterInstruction({
            increment: new Increment({})
        })
    }
    static incrementBy(amount: number): CounterInstruction {
        return new CounterInstruction({
            incrementBy: new IncrementBy({ amount })
        })
    }
    static decrement(): CounterInstruction {
        return new CounterInstruction({
            decrement: new Decrement({})
        })
    }
    static decrementBy(amount: number): CounterInstruction {
        return new CounterInstruction({
            decrementBy: new DecrementBy({ amount })
        })
    }
    static reset(): CounterInstruction {
        return new CounterInstruction({
            reset: new Reset({})
        })
    }
    static resetTo(value: number): CounterInstruction {
        return new CounterInstruction({
            resetTo: new ResetTo({ value })
        })
    }
}

SOLANA_SCHEMA.set(Increment, {
    kind: 'struct',
    fields: [],
});

SOLANA_SCHEMA.set(IncrementBy, {
    kind: 'struct',
    fields: [
        ['amount', 'u8'],
    ],
});

SOLANA_SCHEMA.set(Decrement, {
    kind: 'struct',
    fields: [],
});

SOLANA_SCHEMA.set(DecrementBy, {
    kind: 'struct',
    fields: [
        ['amount', 'u8'],
    ],
});

SOLANA_SCHEMA.set(Reset, {
    kind: 'struct',
    fields: [],
});

SOLANA_SCHEMA.set(ResetTo, {
    kind: 'struct',
    fields: [
        ['value', 'u16'],
    ],
});

SOLANA_SCHEMA.set(CounterInstruction, {
    kind: 'enum',
    field: 'enum',
    values: [
        ['increment', Increment],
        ['incrementBy', IncrementBy],
        ['decrement', Decrement],
        ['decrementBy', DecrementBy],
        ['reset', Reset],
        ['resetTo', ResetTo],
    ],
});