import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { __dirname } from './dirname.js';
import path from 'path';

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname,'view'))); // access static files from the view directory
app.use(express.static("public")); // access static files in the public folder
app.use(express.static(path.join(__dirname, 'src/home'))); 
app.use(express.static(path.join(__dirname, 'src/aboutUs'))); 
app.use(express.static(path.join(__dirname, 'src/landingPage'))); 
app.use(express.static(path.join(__dirname, 'src/navBar'))); 

app.set('view engine', 'ejs'); // set EJS as the view engine

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'landingPage', 'landingPage.html'));
});

app.get('/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'aboutUs', 'aboutUs.html'));
});

app.get('/findJobs', (req, res) => {
    res.render(__dirname + '/view/index.ejs');
});

app.post('/submit', async (req, res) => {
    try {
        const { keywords, location } = req.body;

        // defining the url
        const url = `https://jooble.org/api/${'0dc3b81f-83bc-4e40-8f9a-fa179e531de6'}`;

        // Data for the POST request
        const data = {
            keywords: keywords,
            location: location
        };

        // Set up the request options
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Make a POST request to the provided URL with the provided data using Axios
        const response = await axios.post(url, data, options);

        // Format the job snippets
        const formattedJobs = response.data.jobs.map(job => ({
            ...job,
            snippet: formatJobSnippet(job.snippet)
        }));

        // Update the jobs part of the response data
        const updatedResponseData = {
            ...response.data,
            jobs: formattedJobs
        };

        // Send the response from the external request back to the client
        console.log(response.data);
        res.render(__dirname + '/view/solution.ejs', { jobs: updatedResponseData });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

function formatJobSnippet(snippet) {
    // Replace non-breaking spaces with regular spaces
    return snippet.replace(/&nbsp;/g, ' ');
}
