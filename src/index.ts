import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { connectDB } from './database';
import authRouter from './routes/auth.routes';
import profileRouter from './routes/profile.routes';
import homeRouter from './routes/home.routes';
import appsRouter from './routes/apps.routes';
const app = express();
const port = 3001;

connectDB();

app.use(express.json());

app.use("/", homeRouter)
app.use('/auth', authRouter);
app.use('/private', profileRouter);
app.use("/app", appsRouter)

https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../', 'subject_iscorporacion.key')),
    cert: fs.readFileSync(path.join(__dirname, '../', 'subject_iscorporacion.crt'))
}, app).listen(port, () => {
    console.log(`La aplicación está escuchando en https://localhost:${port}`);
});