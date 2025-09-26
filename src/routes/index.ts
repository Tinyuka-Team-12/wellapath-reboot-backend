import { Router } from 'express'
import userRouter from './user.routes'
import symptomsRouter from './symptoms.routes'
import clinicsRouter from './clinics.routes'
import pharmacyRouter from './pharmacy.routes'
import geoRouter from './geo.routes'
import { requireAuth } from '../middlewares/auth'

const api = Router()

// public
api.use('/clinics', clinicsRouter)
api.use('/pharmacy', pharmacyRouter)
api.use('/geo', geoRouter)

// protected
api.use('/me', requireAuth, userRouter)
api.use('/symptoms', requireAuth, symptomsRouter)

export default api
