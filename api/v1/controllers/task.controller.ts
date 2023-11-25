import { Request, Response } from 'express';
import Task from '../models/task.model';

export const index = async (req: Request, res: Response) => {
    //!Find interface
    interface Find {
        deleted: boolean;
        status?: string;
    }

    const find: Find = {
        deleted: false
    }

    if (req.query.status) {
        find['status'] = req.query.status.toString();
    }
    //!END Find interface

    //! Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toString()] = req.query.sortValue.toString();
    }
    //! End Sort

    const tasks = await Task.find(find)
        .sort(sort);
    res.json(tasks);
}

export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    });

    res.json(task);
}