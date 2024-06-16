import { AnchorProvider } from '@coral-xyz/anchor'
import { PUBKEY_PROFILE_PROGRAM_ID, PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-program-library/anchor'
import { AnchorKeypairWallet, PubKeyProfileSdk } from '@pubkey-program-library/sdk'
import { Keypair, PublicKey } from '@solana/web3.js'
import { ServerConfig } from '../server-config'

export class ProfileService {
  private readonly sdk: PubKeyProfileSdk
  private readonly validProviders: PubKeyIdentityProvider[] = [
    // Add more providers here once the protocol supports them
    PubKeyIdentityProvider.Discord,
    PubKeyIdentityProvider.Github,
    PubKeyIdentityProvider.Google,
    PubKeyIdentityProvider.Solana,
    PubKeyIdentityProvider.Twitter,
  ]

  constructor(private readonly config: ServerConfig) {
    this.sdk = new PubKeyProfileSdk({
      connection: this.config.connection,
      provider: this.getAnchorProvider(),
      programId: PUBKEY_PROFILE_PROGRAM_ID,
    })
  }

  getApiUrl(path: string) {
    return `${this.config.apiUrl}/api${path}`
  }

  getProviders() {
    return this.validProviders
  }

  async getUserProfileByUsername(username: string): Promise<PubKeyProfile | null> {
    this.ensureValidUsername(username)

    try {
      return this.sdk.getProfileByUsernameNullable({ username })
    } catch (e) {
      throw new Error(`User profile not found for username ${username}`)
    }
  }

  async getUserProfileByProvider(provider: PubKeyIdentityProvider, providerId: string): Promise<PubKeyProfile | null> {
    try {
      this.ensureValidProvider(provider)
    } catch (e) {
      throw new Error(`Invalid provider, must be one of ${this.validProviders.join(', ')}`)
    }

    try {
      this.ensureValidProviderId(provider, providerId)
    } catch (e) {
      throw new Error(`Invalid provider ID for provider ${provider}`)
    }
    try {
      return await this.sdk.getProfileByProviderNullable({ provider, providerId })
    } catch (e) {
      throw new Error(`User profile not found for provider ${provider} and providerId ${providerId}`)
    }
  }

  async getUserProfiles(): Promise<PubKeyProfile[]> {
    return this.sdk.getProfiles().then((res) => res.sort((a, b) => a.username.localeCompare(b.username)))
  }

  private ensureValidProvider(provider: PubKeyIdentityProvider) {
    if (!this.validProviders.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`)
    }
  }

  private ensureValidProviderId(provider: PubKeyIdentityProvider, providerId: string) {
    if (provider === PubKeyIdentityProvider.Solana && !isSolanaPublicKey(providerId)) {
      throw new Error(`Invalid provider ID for ${provider}.`)
    }
    if (provider !== PubKeyIdentityProvider.Solana && !isNumericString(providerId)) {
      throw new Error(`Invalid provider ID for ${provider}.`)
    }
  }

  private ensureValidUsername(username: string) {
    if (!isValidUsername(username)) {
      throw new Error(`Invalid username: ${username}`)
    }
  }

  private getAnchorProvider(keypair = Keypair.generate()) {
    return new AnchorProvider(this.config.connection, new AnchorKeypairWallet(keypair), AnchorProvider.defaultOptions())
  }
}
function isNumericString(str: string): boolean {
  return /^\d+$/.test(str)
}

function isSolanaPublicKey(str: string): boolean {
  return !!parseSolanaPublicKey(str)
}

function parseSolanaPublicKey(publicKey: string): PublicKey | null {
  try {
    return new PublicKey(publicKey)
  } catch (e) {
    return null
  }
}

function isValidUsername(username: string): boolean {
  if (username.length < 3 || username.length > 20) {
    return false
  }

  if (!username.split('').every((c) => /^[a-z0-9_]$/.test(c))) {
    return false
  }

  return true
}
