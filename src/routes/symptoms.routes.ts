import { Router } from 'express'
import { listSymptoms, createSymptom, analyzeSymptoms } from '../controllers/symptoms.controller'

const router = Router()

router.get('/', listSymptoms)
router.post('/', createSymptom)
router.post('/analyze', analyzeSymptoms)

export default router
