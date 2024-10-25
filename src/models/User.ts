import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
    id: string;
    email: string;
    nombre: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    id: { type: String, default: uuidv4 }, // Generamos un UUID automáticamente
    nombre: { type: String, required: true }, // Campo del nombre del usuario
    email: {
        type: String,
        required: [true, 'El correo electrónico es requerido'],
        unique: true, // Asegurarse de que el correo sea único
        match: [/.+@.+\..+/, 'Por favor ingrese un correo electrónico válido'],
    }, // Campo de email único
    password: { type: String, required: true }, // Contraseña hasheada
});

export default mongoose.model<IUser>('User', UserSchema);