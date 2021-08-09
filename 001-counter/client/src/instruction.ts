import { Enum, SOLANA_SCHEMA, Struct } from "@solana/web3.js";

class Increment extends Struct { }

class IncrementBy extends Struct {
    amount: number
    constructor(properties: any) {
        super(properties)
        this.amount = properties.amount
    }
}

export class CounterInstruction extends Enum {
    static increment(): CounterInstruction {
        return new CounterInstruction({
            increment: new Increment({})
        })
    }
    static incrementBy(amount: number): CounterInstruction {
        return new CounterInstruction({
            increment_by: new IncrementBy({ amount })
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
        ['amount', 'u16'],
    ],
});

SOLANA_SCHEMA.set(CounterInstruction, {
    kind: 'enum',
    field: 'enum',
    values: [
        ['increment', Increment],
        ['increment_by', IncrementBy],
    ],
});