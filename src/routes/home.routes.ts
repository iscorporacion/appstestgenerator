//ruta para registro y autentificacion
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('¡Hola https');
});

export default router;