/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import DocumentRouter from './src/routers/documentRouter.mjs';
import SessionRouter from "./src/routers/sessionRouter.mjs";
import {errorHandler} from "./src/middlewares/errorhandler.mjs";
import initializeDatabase from "./src/db/initializeDatabase.mjs";


/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};
app.use(cors(corsOptions))
const documentRouter = new DocumentRouter(app);
const sessionRouter = new SessionRouter(app);
app.use('/documents', documentRouter.getRouter());
app.use('/sessions', sessionRouter.getRouter());
errorHandler(app)
await initializeDatabase();


const PORT = 3001;

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
});

// Activating the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));