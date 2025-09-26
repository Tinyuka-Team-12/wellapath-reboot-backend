import { Router } from 'express'
import { getMe } from '../controllers/user.controller'

const router = Router()
router.get('/', getMe)
export default router


/**
 * @openapi
 * /api/me:
 *   get:
 *     summary: Get current user (requires JWT unless dev bypass)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user claims
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 */
