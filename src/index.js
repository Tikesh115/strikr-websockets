import express from 'express';
import { matchRouter } from './routes/matches.js';

const app = express();

// Define the port
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

app.use('/matches', matchRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});