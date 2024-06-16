import { Connection } from '@solana/web3.js'

export interface ServerConfig {
  apiUrl: string
  connection: Connection
  host: string
  port: string
}

export function getServerConfig(): ServerConfig {
  const requiredEnvVars = [
    // Place any required environment variables here
    'SOLANA_RPC_ENDPOINT',
  ]
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]?.length)

  if (missingEnvVars.length > 0) {
    console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`)
    process.exit(1)
  }

  const host = process.env.HOST || '0.0.0.0'
  const port = process.env.PORT || '3000'

  const apiUrl = process.env.API_URL || `http://${host}:${port}`
  const connection = new Connection(process.env.SOLANA_RPC_ENDPOINT, 'confirmed')

  return {
    apiUrl,
    connection,
    host,
    port,
  }
}
