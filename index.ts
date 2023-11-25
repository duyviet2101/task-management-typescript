import cors from 'cors';

import express, { Express, Request, Response } from 'express';
import * as database from "./config/database";
import dotenv from 'dotenv';
import mainV1Routes from './api/v1/routes/index.route';
dotenv.config();

const app: Express = express();
app.use(cors())

const port: number | string = process.env.PORT || 3009;

database.connect();

//? config bodyparse
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mainV1Routes(app);

app.listen(port, () => {
    console.log(`WSV listening at http://localhost:${port}`);
});