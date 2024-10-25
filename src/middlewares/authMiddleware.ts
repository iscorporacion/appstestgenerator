import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verifyToken } from '../auth';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // El token está después de "Bearer"

        try {
            const decoded: JwtPayload = verifyToken(token); // Decodificar el token

            // Guardamos la información del usuario en la request
            req.user = {
                id: decoded.id,
                nombre: decoded.nombre,
                email: decoded.email,
            };

            next(); // Continuar con la siguiente función de middleware o ruta
        } catch (error) {
            return res.status(403).send('Token inválido o expirado');
        }
    } else {
        return res.status(401).send('Autorización requerida');
    }
};