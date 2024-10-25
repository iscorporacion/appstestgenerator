import mongoose from 'mongoose';

// Reemplaza esto con tu URI de conexión desde MongoDB Atlas
const MONGO_URI = 'mongodb+srv://apptestgenerator:Bvs2TTmIiIDhnlce@apptestgenerator.jr6fs.mongodb.net/apptestgenerator?retryWrites=true&w=majority&appName=AppTestGenerator';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
        });
        console.log('Conectado a la base de datos MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};