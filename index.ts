import express, { Express, Request, Response } from 'express';
import * as database from "./config/database";
import dotenv from 'dotenv';
import mainV1Routes from './api/v1/routes/index.route';
dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3009;

database.connect();

mainV1Routes(app);

app.listen(port, () => {
    console.log(`WSV listening at http://localhost:${port}`);
});