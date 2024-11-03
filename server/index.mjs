/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import documentRouter from './src/routers/documentRouter.mjs';

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());




const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'], 
};
app.use(cors(corsOptions))
app.use('/documents', documentRouter);

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});


const PORT = 3001;

// Activating the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));