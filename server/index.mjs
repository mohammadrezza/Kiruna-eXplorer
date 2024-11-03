/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import documentRouter from './src/routers/documentRouter.mjs';

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use('/documents', documentRouter);

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions))

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