/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan';

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());

const PORT = 3001;

// Activating the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));