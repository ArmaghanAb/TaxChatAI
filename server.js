require('dotenv').config();
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;


const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;



// Enable CORS middleware
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to Tax Advisor Chat UI!');
  });
  

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL username
    password: process.env.DB_PASSWORD, 
    database: 'auditdb' // the database created in MySQL Workbench
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


// Route to handle POST request
app.post('/taxPrompt', async (req, res) => {  // Make the function async
    const prompt = req.body.prompt;

    // Keywords to ensure the prompt is tax-related
    const taxKeywords = ['tax', 'deduction', 'income', 'IRS', 'revenue', 'refund', 'exemption', 'tax credit'];
    const isTaxRelated = taxKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    // If the prompt is not tax-related, show an error in the response section and store the error message in the database
    if (!isTaxRelated) {
        const errorMessage = 'Error: Please enter a tax-related question.';
        
        // Insert the non-tax-related prompt with the error message into MySQL
        db.query(
            'INSERT INTO PromptsAndResponses (prompt, response) VALUES (?, ?)',
            [prompt, errorMessage],
            (err, result) => {
                if (err) {
                    console.error('Error inserting into MySQL:', err);
                    res.status(500).send('Database error');
                    return;
                }
                res.json({ message: errorMessage });
            }
        );
        return; // Stop further execution since the prompt is not tax-related
    }
    

    try {

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'x-api-key': process.env.API_KEY,
                    'content-type': 'application/json',
                    'anthropic-version': '2023-06-01',
                },
            }
        );

        // Ensure the response is not null or undefined before inserting into the database
    if (!response.data || !response.data.content || !response.data.content[0].text) {
        const errorMessage = 'Error: Invalid response from API';
        db.query(
            'INSERT INTO PromptsAndResponses (prompt, response) VALUES (?, ?)',
            [prompt, errorMessage],
            (err, result) => {
                if (err) {
                    console.error('Error inserting into MySQL:', err);
                    res.status(500).json({ message: 'Database error' });
                    return;
                }
                res.json({ message: errorMessage });
            }
        );
        return;
    }

        const gptResponse = response.data.content[0].text;

       // const gptResponse = response.data.completion;
        // Insert the prompt and response into MySQL
        db.query(
            'INSERT INTO PromptsAndResponses (prompt, response) VALUES (?, ?)',
            [prompt, gptResponse],
            (err, result) => {
                if (err) {
                    console.error('Error inserting into MySQL:', err);
                    res.status(500).send('Database error');
                    return;
                }
                res.json({ message: gptResponse });
            }
        );
    } catch (error) {
        console.error('Error calling Anthropic API:', error.message);
        res.status(500).send('Error processing request');
    }
});

app.get('/history', (req, res) => {
    // Query the last 5 prompts and responses from the database
    db.query('SELECT * FROM PromptsAndResponses ORDER BY timestamp DESC ', (err, results) => {
        if (err) {
            console.error('Error fetching history from MySQL:', err);
            res.status(500).send('Database error');
        } else {
            res.json(results);  // Send the results to the frontend
        }
    });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
