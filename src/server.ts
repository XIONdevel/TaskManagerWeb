import express from 'express';
import path from 'path';
import cors from 'cors';
import {configureToastr} from "./js/notification";

const app = express();
const PORT = process.env.PORT || 3000;

configureToastr();

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/main.html'));
});

app.get('/login', (req, res) => {
    res.sendFile((path.join(__dirname, '../public/login.html')))
})

app.get('/register', (req, res) => {
    res.sendFile((path.join(__dirname, '../public/register.html')))
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
