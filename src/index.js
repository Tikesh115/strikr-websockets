import express from 'express';

const app = express();

// Define the port
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});