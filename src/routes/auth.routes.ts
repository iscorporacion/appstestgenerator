//ruta para registro y autentificacion
import { Router, Request, Response } from 'express';
import User from '../models/User'; // Importar el modelo de usuario (si es necesario)
import { verifyPassword, generateToken, hashPassword } from '../auth';
import { MongoServerError } from 'mongodb';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const { nombre, email, password } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await hashPassword(password);

        // Crear un nuevo usuario con nombre, email y la contraseña hasheada
        const newUser = new User({ nombre, email, password: hashedPassword });
        await newUser.save();

        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        if (error instanceof MongoServerError) {
            if (error.code === 11000) {
                res.status(400).json({ error: 'Este correo electrónico ya está en uso' });
            } else {
                res.status(500).json({ error: 'Error al registrar el usuario' });
            }
        } else {
            res.status(500).json({ error: 'Error al registrar el usuario' });
        }
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario en la base de datos por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Usuario no encontrado');
        }

        // Verificar la contraseña
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Credenciales incorrectas');
        }

        // Generar token JWT con id, nombre y email
        const token = generateToken({ id: user.id, nombre: user.nombre, email: user.email });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
});

export default router;