import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { __dirname } from './dirname.js';
import { connectDB, getDB } from './db.js';

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'src/home'))); 
app.use(express.static(path.join(__dirname, 'src/aboutUs'))); 
app.use(express.static(path.join(__dirname, 'src/landingPage'))); 
app.use(express.static(path.join(__dirname, 'src/navBar'))); 

app.set('view engine', 'ejs');

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

app.get('/interviewGuide', (req, res) => {
    res.render(__dirname + '/view/interviewGuide.ejs');
});

app.get('/interviewExperience', async (req, res) => {
    try {
        const db = getDB();
        const experiences = await db.collection('interviewExperiences').find().toArray(); // Retrieve all experiences from MongoDB
        res.render(__dirname + '/view/interviewExperience.ejs', { experiences });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving experiences');
    }
});

app.post('/addExperience', async (req, res) => {
    try {
        const { company, position, experience } = req.body;
        const db = getDB();

        // Insert a new interview experience document
        await db.collection('interviewExperiences').insertOne({
            company,
            position,
            experience
        });

        res.redirect('/interviewExperience');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while saving the experience');
    }
});

app.post('/submit', async (req, res) => {
    try {
        const { keywords, location } = req.body;

        const url = `https://jooble.org/api/${'0dc3b81f-83bc-4e40-8f9a-fa179e531de6'}`;
        const data = { keywords, location };
        const options = { headers: { 'Content-Type': 'application/json' } };

        const response = await axios.post(url, data, options);

        const formattedJobs = response.data.jobs.map(job => ({
            ...job,
            snippet: formatJobSnippet(job.snippet)
        }));

        const updatedResponseData = { ...response.data, jobs: formattedJobs };

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
    return snippet.replace(/&nbsp;/g, ' ');
}
