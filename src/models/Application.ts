import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; // Asegúrate de que la ruta es correcta

export interface IApplication extends Document {
    name: string;
    description: string;
    user: IUser['id']; // Usamos el id (UUID) del usuario
}

const applicationSchema = new Schema<IApplication>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: String, ref: 'User', required: true } // Relación con el usuario usando su UUID
});

// Crear un índice único compuesto para 'user' y 'name'
applicationSchema.index({ user: 1, name: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);