const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');  // Import cors middleware

// Explicitly load the .env file from the root directory
dotenv.config({ path: '../.env' });

const app = express();
// Enable CORS
app.use(cors());

app.use(express.json());
console.log('MISTRAL_API_KEY:', process.env.MISTRAL_API_KEY); // Add this line for debugging

// return false;
// OpenAI Chat Completion
app.post('/analyze', async (req, res) => {
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            prompt: req.body.text,
            model: 'gpt-3.5-turbo',
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error in /analyze:', error.response ? error.response.data : error.message); // Log detailed error
        res.status(500).json({ error: 'Error analyzing content' });
    }
});

// Mistral Chat Completion API
app.post('/recommend', async (req, res) => {
    try {
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
            model: 'mistral-small-latest',  // Specify the model you want to use
            messages: [
                { role: 'user', content: req.body.text }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,  // Mistral API key from .env
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error in /recommend:', error.response ? error.response.data : error.message);  // Log detailed error
        res.status(500).json({ error: 'Error generating recommendations' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));