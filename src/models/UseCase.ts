import mongoose, { Schema, Document } from 'mongoose';
import { IModule } from './Module';

export interface ITestCase extends Document {
    caseId: string;
    description: string;
    preconditions: string;
    actions: string;
    expectedResult: string;
}

export interface IUseCase extends Document {
    title: string;
    module: IModule['id']; // Relación con el módulo usando su ID
    testCases: ITestCase[];
}

const testCaseSchema = new Schema<ITestCase>({
    caseId: { type: String, required: true }, // Ej. "Caso de prueba 1.1"
    description: { type: String, required: true }, // Ej. "Verificar el inicio de sesión exitoso con credenciales válidas de Microsoft Active Directory."
    preconditions: { type: String, required: true }, // Ej. "El usuario debe tener credenciales de Microsoft AD válidas."
    actions: { type: String, required: true }, // Ej. "Iniciar sesión utilizando las credenciales de Microsoft AD."
    expectedResult: { type: String, required: true }, // Ej. "El sistema permite el acceso al usuario sin errores."
});

const useCaseSchema = new Schema<IUseCase>({
    title: { type: String, required: true }, // Ej. "Login con Microsoft en Directorio Activo"
    module: { type: String, ref: 'Module', required: true }, // Relación con el módulo
    testCases: [testCaseSchema], // Array de casos de prueba
});

export const UseCase = mongoose.model<IUseCase>('UseCase', useCaseSchema);
export const TestCase = mongoose.model<ITestCase>('TestCase', testCaseSchema);
