const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define the API endpoint for image generation
app.post('/generate-image', async (req, res) => {
    const { description, width, height, guidance_scale, num_inference_steps, scheduler, seed } = req.body;

    const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
    const headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    };

    const payload = {
        inputs: description,
        parameters: {
            width,
            height,
            guidance_scale,
            num_inference_steps,
            scheduler,
            seed
        }
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

        const imageBlob = await response.buffer(); // Get the image as a Buffer
        res.set('Content-Type', 'image/png'); // Set the response content type to PNG
        res.send(imageBlob); // Send the image buffer as a response
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
