import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// Reemplaza esto con tu URI de conexión desde MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('La URI de conexión a la base de datos no está definida');
        }
        await mongoose.connect(MONGO_URI, {
        });
        console.log('Conectado a la base de datos MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};