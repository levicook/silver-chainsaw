import { resolve } from 'path'
import borsh from 'borsh'
import fs from 'fs'
import { Connection, Keypair, sendAndConfirmTransaction, Transaction, TransactionInstruction } from "@solana/web3.js"
import { CounterInstruction } from './instruction'

main(process.argv.slice(2)).then(
    () => process.exit(0),
    (err) => {
        console.error(err)
        process.exit(1)
    }
)

async function main(args: string[]) {
    const ix1 = CounterInstruction.incrementBy(5)
    const ix2 = CounterInstruction.decode(ix1.encode())
    console.log(ix1 == ix2)
    console.log('ix1', ix1)
    console.log('ix2', ix2)
}

async function mainx(args: string[]) {
    // let [instruction, amount] = args
    // eg: increment_by 10
    // eg: decrement_by 20

    const endpoint = 'http://localhost:8899'
    const programKeypair = readKeypair(programKeypairPath())
    const aliceKeypair = readKeypair(aliceKeypairPath())
    const bobKeypair = readKeypair(bobKeypairPath())

    const connection = new Connection(endpoint, 'confirmed')
    const version = await connection.getVersion()
    console.log('Connection established:', {
        endpoint,
        programKeypair: programKeypair.publicKey.toBase58(),
        aliceKeypair: aliceKeypair.publicKey.toBase58(),
        bobKeypair: bobKeypair.publicKey.toBase58(),
        version
    })

    const programId = programKeypair.publicKey
    const programInfo = await connection.getAccountInfo(programId)
    if (!programInfo) {
        throw new Error('Program needs to be deployed')
    }
    if (!programInfo.executable) {
        throw new Error('Program is not executable')
    }
    console.log(`Program confirmed: ${programId}`)

    const ix = new TransactionInstruction({
        keys: [],
        programId,
        data: Buffer.alloc(0), // THIS SHOULD FAIL!
    })

    const tx = new Transaction()
    tx.add(ix)

    const signers = [aliceKeypair]
    await sendAndConfirmTransaction(connection, tx, signers)

    // inc as alice
    // inc as bob
    // inc_by as alice
    // inc_by as bob
    // etc...
}

function readKeypair(filePath: string): Keypair {
    const rawSecret = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const secretKey = Uint8Array.from(JSON.parse(rawSecret))
    return Keypair.fromSecretKey(secretKey)
}

function programKeypairPath(): string {
    return resolve(__dirname, '../../program/target/deploy/counter-keypair.json')
}

function aliceKeypairPath(): string {
    return resolve(__dirname, '../../../keypairs/alice-keypair.json')
}

function bobKeypairPath(): string {
    return resolve(__dirname, '../../../keypairs/bob-keypair.json')
}