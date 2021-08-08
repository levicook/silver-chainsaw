import { Connection, Keypair } from "@solana/web3.js"
import path from 'path'

const usage = `
<ENDPOINT> <KEYPAIR1> <KEYPAIR2>
`

async function main(args: string[]) {
    let [endpoint, keypair1, keypair2] = args
    endpoint = endpoint || 'http://localhost:8899'
    keypair1 = keypair1 || path.resolve(__dirname, '../../../keypairs/alice-keypair.json')
    keypair2 = keypair2 || path.resolve(__dirname, '../../../keypairs/bob-keypair.json')

    const connection = new Connection(endpoint, 'confirmed')
    const version = await connection.getVersion()
    console.log('Connection established:', endpoint, version);
}

main(process.argv.slice(2)).then(
    () => process.exit(0),
    (err) => {
        console.error(err)
        process.exit(1)
    }
)