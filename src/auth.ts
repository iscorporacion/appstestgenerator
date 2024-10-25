import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = 'your_secret_key'; // Puedes mover esto a un archivo de variables de entorno (recomendado)

export interface JwtPayload {
    id: string;
    nombre: string;
    email: string;
}
// Función para generar un JWT
export const generateToken = (user: { id: string, nombre: string, email: string }) => {
    return jwt.sign({ id: user.id, nombre: user.nombre, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
};

// Función para verificar el JWT
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY) as JwtPayload;
    } catch (error) {
        throw new Error('Token inválido');
    }
};

// Función para verificar la contraseña
export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Función para encriptar contraseñas
export const hashPassword = async (plainPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
};