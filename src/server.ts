import express from 'express';
import path from 'path';
import cors from 'cors';
import {configureToastr} from "./js/notification";
import authRouter from "./js/auth/router";
import cookieParser from "cookie-parser";
import {isAuthenticated} from "./js/auth/service";

const app = express();
const PORT = process.env.PORT || 3000;


configureToastr();

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(express.json());
app.use(cors());


app.get('/', async (req, res) => {
    if (await isAuthenticated(req)) {
        res.sendFile(path.join(__dirname, '../public/main.html'));
    } else {
        res.redirect("/login");
    }
});

app.get('/login', async (req, res) => {
    if (await isAuthenticated(req)) {
        res.redirect("/");
    } else {
        res.sendFile((path.join(__dirname, '../public/login.html')));
    }
})

app.get('/register', async (req, res) => {
    if (await isAuthenticated(req)) {
        res.redirect("/");
    } else {
        res.sendFile((path.join(__dirname, '../public/register.html')));
    }
})

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
