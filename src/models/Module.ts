import mongoose, { Schema, Document } from 'mongoose';
import { IApplication } from './Application';

export interface IModule extends Document {
    name: string;
    description: string;
    status: string;
    date: Date;
    application: IApplication['id']; // Relacionamos con el id de la aplicación
}

const moduleSchema = new Schema<IModule>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    application: { type: String, ref: 'Application', required: true } // Relación con la aplicación usando su id
});

// Crear un índice único compuesto para 'application' y 'name'
moduleSchema.index({ application: 1, name: 1 }, { unique: true });

export const Module = mongoose.model<IModule>('Module', moduleSchema);
