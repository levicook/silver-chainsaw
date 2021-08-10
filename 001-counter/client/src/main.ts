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

async function main(cmd: string, args: string[]) {
    function usage() {
        console.log(`
ensure-program-state-account-ready
    `.trim())
    }

    switch (cmd) {
        case 'ensure-program-state-account-ready':
            await ensureProgramStateAccountReady(args)
            break
        default:
            usage();
    }
}

async function ensureProgramStateAccountReady(args: string[]) {
    try {
        const oldAccountKeypair = readProgramStateKeypair();
        const oldAccountPubkey = oldAccountKeypair.publicKey;
        console.log(oldAccountPubkey.toBase58());
        return
    } catch (err) {
        console.log('creating program state account');

        const aliceKeypair = readAliceKeypair();
        const fromPubkey = aliceKeypair.publicKey;
        const programKeypair = readProgramKeypair();
        const programId = programKeypair.publicKey;
        const newAccountKeypair = new Keypair();
        const newAccountPubkey = newAccountKeypair.publicKey;

        const connection = await connect();

        const space = 4
        const lamports = await connection.getMinimumBalanceForRentExemption(space, 'singleGossip');

        const tx = new Transaction();
        tx.add(SystemProgram.createAccount({
            space,
            lamports,
            fromPubkey,
            newAccountPubkey,
            programId,
        }))

        const signers = [aliceKeypair, newAccountKeypair];
        await connection.sendTransaction(tx, signers);

        fs.writeFileSync(programStateKeypairPath(),
            JSON.stringify(Array.from(newAccountKeypair.secretKey)),
            'utf-8',
        );

        console.log(newAccountPubkey.toBase58())
    }
}

async function mainx(args: string[]) {
    // let [instruction, amount] = args
    // eg: increment_by 10
    // eg: decrement_by 20

    const programKeypair = readProgramKeypair()
    const aliceKeypair = readAliceKeypair()
    const bobKeypair = readBobKeypair()

    const connection = await connect()

    const programId = programKeypair.publicKey
    const programInfo = await connection.getAccountInfo(programId)
    if (!programInfo) {
        throw new Error('Program needs to be deployed')
    }
    if (!programInfo.executable) {
        throw new Error('Program is not executable')
    }
    console.log(`Program confirmed: ${programId}`)

    // TODO: create the coutner program's storage account
    // TODO: fund the coutner program's storage account
    // TODO: pass it in as a writeable account on inc, dec

    // const data = CounterInstruction.increment().encode()
    const data = CounterInstruction.incrementBy(65535).encode()
    // const data = CounterInstruction.decrement().encode()
    // const data = Buffer.alloc(0)

    const instruction = new TransactionInstruction({
        programId,
        keys: [
            { pubkey: programId, isSigner: false, isWritable: true },
            { pubkey: aliceKeypair.publicKey, isSigner: true, isWritable: false },
            // { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        ],
        data,
    })
    // console.log('ix', instruction)

    const transaction = new Transaction({
        // recentBlockhash,
        feePayer: aliceKeypair.publicKey,
        // signatures,
    })
    transaction.add(instruction)

    const signers = [aliceKeypair]
    const rx = await sendAndConfirmTransaction(connection, transaction, signers)

    console.log('rx', rx)
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