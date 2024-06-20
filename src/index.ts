import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const dbPath = path.join(__dirname, 'db.json');


interface Submission {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
}

let submissions: Submission[] = [];


if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf8');
    submissions = JSON.parse(data);
} else {
    // If db.json doesn't exist, create an empty file
    fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
}


app.get('/', (req, res) => {
    res.send('Server is running. Available endpoints: /ping, /submit, /read');
});


app.get('/ping', (req, res) => {
    res.json(true);
});


app.post('/submit', (req, res) => {
    const newSubmission: Submission = req.body;
    submissions.push(newSubmission);
    fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
    res.status(201).json(newSubmission);
});


app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    if (isNaN(index) || index < 0 || index >= submissions.length) {
        res.status(404).json({ error: 'Invalid index or submission not found' });
    } else {
        res.json(submissions[index]);
    }
});


app.get('/allsubmissions', (req, res) => {
    res.json(submissions);
});


app.put('/edit', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    if (isNaN(index) || index < 0 || index >= submissions.length) {
        res.status(404).json({ error: 'Invalid index or submission not found' });
    } else {
        const updatedSubmission: Submission = req.body;
        submissions[index] = updatedSubmission;
        fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
        res.json(updatedSubmission);
    }
});


app.delete('/delete', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    if (isNaN(index) || index < 0 || index >= submissions.length) {
        res.status(404).json({ error: 'Invalid index or submission not found' });
    } else {
        const deletedSubmission = submissions.splice(index, 1)[0];
        fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
        res.json(deletedSubmission);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
