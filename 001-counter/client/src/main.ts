import { basename, resolve } from 'path'
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
            return await decrementBy(args)
        case 'ensure-program-state-account-ready':
            return await ensureProgramStateAccountReady()
        case 'increment':
            return await increment(args)
        case 'increment-by':
            return await incrementBy(args)
        default:
            throw new Error(`Unrecognized command: '${command}'`)
    }
}

async function ensureProgramStateAccountReady() {
    const connection = await connect();

    const programStateKeypair = readProgramStateKeypair();
    const balance = await connection.getBalance(programStateKeypair.publicKey)
    if (balance > 0) {
        console.log(`program state account exists; balance: ${balance}`);
        return
    }

    const aliceKeypair = readAliceKeypair();
    const programKeypair = readProgramKeypair();
    const space = 4

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
    ]);
}

async function increment(args: string[]) {
    await sendCounterInstruction(CounterInstruction.increment());
}

async function incrementBy(args: string[]) {
    // TODO map args to instructions, issue one tx
    await Promise.all(args.map(async arg => {
        const amount = parseInt(arg, 10);
        await sendCounterInstruction(CounterInstruction.incrementBy(amount));
    }))
}

async function decrement(args: string[]) {
    await sendCounterInstruction(CounterInstruction.decrement());
}

async function decrementBy(args: string[]) {
    // TODO map args to instructions, issue one tx
    await Promise.all(args.map(async arg => {
        const amount = parseInt(arg, 10);
        await sendCounterInstruction(CounterInstruction.decrementBy(amount));
    }))
}

async function sendCounterInstruction(counterInstruction: CounterInstruction) {
    const connection = await connect()

    const programKeypair = readProgramKeypair();
    const programStateKeypair = readProgramStateKeypair();
    const aliceKeypair = readAliceKeypair()

    const tx = new Transaction({
        feePayer: aliceKeypair.publicKey
    });

    tx.add(new TransactionInstruction({
        programId: programKeypair.publicKey,
        keys: [
            { pubkey: programStateKeypair.publicKey, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        ],
        data: counterInstruction.encode(),
    }));

    const signers = [aliceKeypair];
    console.log(await sendAndConfirmTransaction(connection, tx, signers));
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