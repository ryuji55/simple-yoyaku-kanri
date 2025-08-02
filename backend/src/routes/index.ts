import { Router } from 'express'
import authRoutes from './authRoutes'
import storeRoutes from './storeRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use(storeRoutes)

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

export default router