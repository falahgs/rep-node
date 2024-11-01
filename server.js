import express from 'express';
import fetch from 'node-fetch'; // Use node-fetch to handle HTTP requests

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public')); // Serve static files from a directory named 'public'

// API endpoint to handle image generation
app.post('/generate-image', async (req, res) => {
    const payload = req.body;
    const API_URL = payload.apiUrl; // Get the model URL from the payload
    const headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status code ${response.status}: ${await response.text()}`);
        }

        const imageBuffer = await response.buffer(); // Use buffer for binary data
        res.set('Content-Type', 'image/png'); // Assuming the returned image is PNG
        res.send(imageBuffer); // Send the image as a response
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
