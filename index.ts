import express, { Express, Request, Response } from 'express';
import * as database from "./config/database";
import dotenv from 'dotenv';
import Task from './models/task.model';
dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3009;

database.connect();


app.get('/task', async (req: Request, res: Response) => {
    const tasks = await Task.find({
        deleted: false
    });
    res.json(tasks);
});

app.listen(port, () => {
    console.log(`WSV listening at http://localhost:${port}`);
});