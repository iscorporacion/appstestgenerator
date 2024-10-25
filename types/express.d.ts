import { JwtPayload } from '../auth'; // Asegúrate de importar correctamente desde donde tengas definida la interfaz

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload; // Aquí indicamos que req.user será del tipo JwtPayload
        }
    }
}