/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import documentRouter from './src/routers/documentRouter.mjs';
import sessionRouter from "./src/routers/sessionRouter.mjs";
import Auth from "./src/auth/auth.mjs";
import {errorHandler} from "./src/middlewares/errorhandler.mjs";
import initializeDatabase from "./src/db/initializeDatabase.mjs";


/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());
new Auth(app);


const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'], 
};
app.use(cors(corsOptions))
app.use('/documents', documentRouter);
app.use('/sessions', sessionRouter);
errorHandler(app)
await initializeDatabase();


const PORT = 3001;

// Activating the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));