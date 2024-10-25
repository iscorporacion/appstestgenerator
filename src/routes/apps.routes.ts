import { Router, Request, Response } from 'express';
const router = Router();

import { MongoServerError } from 'mongodb';
import { authenticateJWT } from '../middlewares/authMiddleware';

import { Application } from '../models/Application';
import { Module } from '../models/Module';

//ruta para registro y autentificacion sufijo /apps
// Crear una nueva aplicación para el usuario autenticado
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const application = new Application({
        name,
        description,
        user: req.user.id // Usamos el id del usuario autenticado
    });

    try {
        const savedApplication = await application.save();
        res.status(201).json({ message: 'Aplicación creada', savedApplication });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la aplicación' });
    }
});

// Obtener todas las aplicaciones del usuario autenticado
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const applications = await Application.find({ user: req.user.id });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las aplicaciones' });
    }
});

// Obtener una aplicación específica por su id
router.get('/:appId', authenticateJWT, async (req: Request, res: Response) => {
    const { appId } = req.params;

    console.log(req.user.id);

    try {
        const application = await Application.findOne({ _id: appId, user: req.user.id });
        if (!application) return res.status(404).json({ error: 'Aplicación no encontrada o no autorizada' });

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la aplicación' });
    }
});

//eliminar una aplicacion y sus modulos
router.delete('/:appId', authenticateJWT, async (req: Request, res: Response) => {
    const { appId } = req.params;

    try {
        // Verifica que la aplicación pertenezca al usuario
        const application = await Application.findOne({ _id: appId, user: req.user.id });
        if (!application) return res.status(404).json({ error: 'Aplicación no encontrada o no autorizada' });

        // Elimina la aplicación y sus módulos
        await Module.deleteMany({ application: appId });
        await application.deleteOne();

        res.json({ message: 'Aplicación eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la aplicación' });
    }
});

// Crear un nuevo módulo para una aplicación específica
router.post('/:appId/modules', authenticateJWT, async (req: Request, res: Response) => {
    const { appId } = req.params;
    const { name, description, status } = req.body;
    console.log(req.body);

    if (!name || !description || status === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // Verifica que la aplicación pertenezca al usuario
        const application = await Application.findOne({ _id: appId, user: req.user.id });
        if (!application) return res.status(404).json({ error: 'Aplicación no encontrada o no autorizada' });

        const module = new Module({ name, description, status, application: appId });
        const savedModule = await module.save();
        res.status(201).json({ message: 'Módulo creado', savedModule });
    } catch (error) {
        if (error instanceof MongoServerError) {
            if (error.code === 11000) {
                res.status(400).json({ error: `El modulo '${(name as string).toLocaleUpperCase()}' ya existe` });
            } else {
                res.status(500).json({ error: 'Error al crear el módulo' });
            }
        } else {
            res.status(500).json({ error: 'Error al crear el módulo' });
        }
    }
});

//eliminar modulo
router.delete('/:appId/modules/:moduleId', authenticateJWT, async (req: Request, res: Response) => {
    const { moduleId } = req.params;

    try {
        // Verifica que el módulo pertenezca a la aplicación del usuario
        const module = await Module.findOne({ _id: moduleId }).populate('application');
        if (!module || module.application.user !== req.user.id) {
            return res.status(404).json({ error: 'Módulo no encontrado o no autorizado' });
        }

        await module.deleteOne();
        res.json({ message: 'Módulo eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el módulo' });
    }
});

//eliminar todos los modulos de una aplicacion
router.delete('/:appId/modules', authenticateJWT, async (req: Request, res: Response) => {
    const { appId } = req.params;

    try {
        // Verifica que la aplicación pertenezca al usuario
        const application = await Application.findOne({ _id: appId, user: req.user.id });
        if (!application) return res.status(404).json({ error: 'Aplicación no encontrada o no autorizada' });

        // Elimina todos los módulos de la aplicación
        await Module.deleteMany({ application: appId });

        res.json({ message: 'Módulos eliminados' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los módulos' });
    }
});

//actualizar modulo
router.put('/:appId/modules/:moduleId', authenticateJWT, async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const { name, description, status } = req.body;

    if (!name || !description || status === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // Verifica que el módulo pertenezca a la aplicación del usuario
        const module = await Module.findOne({ _id: moduleId }).populate('application');
        if (!module || module.application.user !== req.user.id) {
            return res.status(404).json({ error: 'Módulo no encontrado o no autorizado' });
        }

        module.name = name;
        module.description = description;
        module.status = status;
        await module.save();

        res.json({ message: 'Módulo actualizado', module });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el módulo' });
    }
});


// Obtener todos los módulos de una aplicación específica
router.get('/:appId/modules', authenticateJWT, async (req: Request, res: Response) => {
    const { appId } = req.params;

    try {
        // Verifica que la aplicación pertenezca al usuario
        const application = await Application.findOne({ _id: appId, user: req.user.id });
        if (!application) return res.status(404).json({ error: 'Aplicación no encontrada o no autorizada' });

        const modules = await Module.find({ application: appId });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los módulos' });
    }
});

//cambia el estado de un modulo
router.patch('/:appId/modules/:moduleId', authenticateJWT, async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const { status } = req.body;

    if (status === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // Verifica que el módulo pertenezca a la aplicación del usuario
        const module = await Module.findOne({ _id: moduleId }).populate('application');
        if (!module || module.application.user !== req.user.id) {
            return res.status(404).json({ error: 'Módulo no encontrado o no autorizado' });
        }

        module.status = status;
        await module.save();

        res.json({ message: 'Estado del módulo actualizado', module });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del módulo' });
    }
});

export default router;