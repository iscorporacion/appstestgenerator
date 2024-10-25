import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { JwtPayload } from '../auth';

const router = Router();

router.get('/profile', authenticateJWT, (req: Request, res: Response) => {
    const user: JwtPayload = req.user;

    if (!user) {
        return res.status(401).send('Autorización requerida');
    }

    res.json({
        id: user?.id,
        nombre: user?.nombre,
        email: user?.email,
    });
});

export default router;