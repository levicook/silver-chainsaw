import { resolve } from 'path'
import borsh from 'borsh'
import fs from 'fs'
import { Connection, Keypair, sendAndConfirmTransaction, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js"
import { CounterInstruction } from './instruction'

main(process.argv.slice(2)).then(
    () => process.exit(0),
    (err) => {
        console.error(err)
        process.exit(1)
    }
)

// async function main(args: string[]) {
//     console.log('>> increment    ', CounterInstruction.increment().encode().toString('hex'))
//     console.log('>> increment_by ', CounterInstruction.incrementBy(5).encode().toString('hex'))
//     console.log('>> decrement    ', CounterInstruction.decrement().encode().toString('hex'))
//     console.log('>> decrement_by ', CounterInstruction.decrementBy(5).encode().toString('hex'))
// }

async function main(args: string[]) {
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

    const data = CounterInstruction.incrementBy(65535).encode()
    // const data = CounterInstruction.decrement().encode()

    const ix = new TransactionInstruction({
        programId,
        keys: [
            { pubkey: programId, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        ],
        data,
    })
    console.log('ix', ix)

    const tx = new Transaction({
        // recentBlockhash,
        feePayer: aliceKeypair.publicKey,
        // signatures,
    })
    tx.add(ix)
    console.log('tx', tx)

    const signers = [aliceKeypair]
    console.log('??', await sendAndConfirmTransaction(connection, tx, signers))

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