import { resolve } from 'path'
import fs from 'fs'
import { Connection, Keypair, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js"
import { CounterInstruction } from './instruction'

(function () {
    const [cmd, ...args] = process.argv.slice(2)
    main(cmd, args).then(() => process.exit(0), (err) => {
        console.error(err)
        process.exit(1)
    })
}())

async function main(command: string, args: string[]) {
    switch (command) {
        case 'decrement':
            return await decrement(args)
        case 'decrement-by':
        case 'decrement_by':
            return await decrementBy(args)
        case 'increment':
            return await increment(args)
        case 'increment-by':
        case 'increment_by':
            return await incrementBy(args)
        case 'reset':
            return await reset(args)
        case 'reset-to':
        case 'reset_to':
            return await resetTo(args)
        default:
            throw new Error(`Unrecognized command: '${command}'`)
    }
}

async function ensureRentExempt(connection: Connection, programStateKeypair: Keypair) {
    const balance = await connection.getBalance(programStateKeypair.publicKey)
    if (balance > 0) {
        return
    }

    const aliceKeypair = readAliceKeypair();
    const programKeypair = readProgramKeypair();
    const space = 2

    const tx = new Transaction();
    tx.add(SystemProgram.createAccount({
        space,
        lamports: await connection.getMinimumBalanceForRentExemption(space, 'singleGossip'),
        fromPubkey: aliceKeypair.publicKey,
        newAccountPubkey: programStateKeypair.publicKey,
        programId: programKeypair.publicKey,
    }));

    await connection.sendTransaction(tx, [
        aliceKeypair,
        programStateKeypair,
    ], {
        preflightCommitment: 'max',
        skipPreflight: false,
    });
}

async function decrement(args: string[]) {
    const ixs = [CounterInstruction.decrement()];
    await sendInstructions(ixs);
}

async function decrementBy(args: string[]) {
    const ixs = args.map(arg => CounterInstruction.decrementBy(parseInt(arg, 10)))
    await sendInstructions(ixs);
}

async function increment(args: string[]) {
    const ixs = [CounterInstruction.increment()];
    await sendInstructions(ixs);
}

async function incrementBy(args: string[]) {
    const ixs = args.map(arg => CounterInstruction.incrementBy(parseInt(arg, 10)))
    await sendInstructions(ixs);
}

async function reset(args: string[]) {
    const ixs = [CounterInstruction.reset()];
    await sendInstructions(ixs);
}

async function resetTo(args: string[]) {
    const ixs = args.map(arg => CounterInstruction.resetTo(parseInt(arg, 10)))
    await sendInstructions(ixs);
}

async function sendInstructions(instructions: CounterInstruction[]) {
    const connection = await connect()
    const programKeypair = readProgramKeypair();
    const programStateKeypair = readProgramStateKeypair();
    const aliceKeypair = readAliceKeypair();

    // NOTE: We outrun this on a brand-new chain / deployment
    await ensureRentExempt(connection, programStateKeypair);

    const tx = new Transaction({
        feePayer: aliceKeypair.publicKey
    });

    instructions.forEach(instruction => {
        tx.add(new TransactionInstruction({
            programId: programKeypair.publicKey,
            keys: [
                { pubkey: programStateKeypair.publicKey, isSigner: false, isWritable: true },
                { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            ],
            data: instruction.encode(),
        }));
    })

    const signers = [aliceKeypair];
    const txId = await sendAndConfirmTransaction(connection, tx, signers);

    console.log('Transaction', txId, await connection.getTransaction(txId, {
        commitment: 'confirmed'
    }));
}

async function connect(): Promise<Connection> {
    return new Connection(readEndpoint(), 'singleGossip')
}

function readEndpoint() {
    return 'http://localhost:8899'
}

function readProgramKeypair() {
    return readKeypair(programKeypairPath())
}

function readProgramStateKeypair() {
    return readKeypair(programStateKeypairPath())
}

function readAliceKeypair() {
    return readKeypair(aliceKeypairPath())
}

function readBobKeypair() {
    return readKeypair(bobKeypairPath())
}

function readKeypair(filePath: string): Keypair {
    const rawSecret = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const secretKey = Uint8Array.from(JSON.parse(rawSecret))
    return Keypair.fromSecretKey(secretKey)
}

function programKeypairPath(): string {
    return resolve(__dirname, '../../../keypairs/counter-keypair.json')
}

function programStateKeypairPath(): string {
    return resolve(__dirname, '../../../keypairs/counter-state-keypair.json')
}

function aliceKeypairPath(): string {
    return resolve(__dirname, '../../../keypairs/alice-keypair.json')
}

function bobKeypairPath(): string {
    return resolve(__dirname, '../../../keypairs/bob-keypair.json')
}