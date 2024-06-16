import express, { Request, Response } from 'express'
import { profilesRoutes } from './features/profiles.routes'
import { ServerConfig } from './server-config'

export function serverRouter(config: ServerConfig): express.Router {
  const router = express.Router()

  router.use('/profiles', profilesRoutes(config))
  router.use('/uptime', (_: Request, res: Response) => res.json({ uptime: process.uptime() }))
  router.use('/', (_: Request, res: Response) => res.send('PubKey API'))
  router.use('*', (_: Request, res: Response) => res.status(404).send('Not Found'))

  return router
}
