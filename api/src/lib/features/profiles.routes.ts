import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import express, { Request, Response } from 'express'
import { ServerConfig } from '../server-config'
import { ProfileService } from './profile.service'

export function profilesRoutes(config: ServerConfig): express.Router {
  const router = express.Router()
  const service = new ProfileService(config)

  router.get('', (_: Request, res: Response) => {
    return res.send(
      [
        '/profiles/all',
        '/profiles/providers',
        '/profiles/provider/:provider/:providerId',
        '/profiles/username/:username',
      ].map((p) => service.getApiUrl(p)),
    )
  })

  router.get('/all', async (_: Request, res: Response) => {
    return res.send(await service.getUserProfiles())
  })

  router.get('/providers', (_: Request, res: Response) => {
    return res.send(service.getProviders())
  })

  router.get('/provider/:provider/:providerId', async (req: Request, res: Response) => {
    const { provider, providerId } = req.params

    try {
      const profile = await service.getUserProfileByProvider(provider as PubKeyIdentityProvider, providerId)
      if (!profile) {
        return res.status(404).send(`User profile not found for provider ${provider} and providerId ${providerId}`)
      }
      return res.send(profile)
    } catch (e) {
      return res.status(404).send(e.message)
    }
  })

  router.get('/username/:username', async (req: Request, res: Response) => {
    const { username } = req.params

    try {
      const profile = await service.getUserProfileByUsername(username)
      if (!profile) {
        return res.status(404).send(`User profile not found for username ${username}`)
      }
      return res.send(profile)
    } catch (e) {
      return res.status(404).send(e.message)
    }
  })

  router.use('*', (req: Request, res: Response) => res.status(404).send('Profile Not Found'))

  return router
}
