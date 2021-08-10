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
        case 'ensure-program-state-account-ready':
            return await ensureProgramStateAccountReady(args)
        case 'increment':
            return await increment(args)
        default:
            throw new Error(`Unrecognized command: '${command}'`)
    }
}

async function ensureProgramStateAccountReady(args: string[]) {
    const programStateKeypair = readProgramStateKeypair();
    const connection = await connect();
    const balance = await connection.getBalance(programStateKeypair.publicKey)
    if (balance > 0) {
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
// const data = CounterInstruction.incrementBy(65535).encode()

async function increment(args: string[]) {
    await sendCounterInstruction(CounterInstruction.increment());
}

async function decrement(args: string[]) {
    await sendCounterInstruction(CounterInstruction.decrement());
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

    const signers = [aliceKeypair]
    const txid = await sendAndConfirmTransaction(connection, tx, signers)
    console.log('txid', txid)
}

async function connect(): Promise<Connection> {
    const endpoint = readEndpoint()
    const connection = new Connection(endpoint, 'singleGossip')
    const version = await connection.getVersion()
    // console.log('Connection established:', { endpoint, version })
    return connection
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
    return resolve(__dirname, '../../program/target/deploy/counter-keypair.json')
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