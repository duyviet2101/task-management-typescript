import { Request, Response } from 'express';
import Task from '../models/task.model';
import paginationHelper from '../../../helpers/pagination';
import searchHelper from '../../../helpers/search';

export const index = async (req: Request, res: Response) => {
    //?Find interface
    interface Find {
        deleted: boolean;
        status?: string;
        title?: RegExp;
    }

    const find: Find = {
        deleted: false
    }

    if (req.query.status) {
        find['status'] = req.query.status.toString();
    }
    //?END Find interface

    //? Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toString()] = req.query.sortValue.toString();
    }
    //? End Sort

    //?search
    let objectSearch = searchHelper(req.query)
    if (req.query.keyword) {
      find.title = objectSearch.regex
    }
    //?end search

    //? pagination
    const initPagination = {
        currentPage: 1,
        limitItems: 2
    }
    const countTask = await Task.countDocuments(find)
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTask
    )
    //? end pagination

    const tasks = await Task.find(find)
        .sort(sort)
        .skip(objectPagination.skip)
        .limit(objectPagination.limitItems)
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

// [PATCH] /api/v1/tasks/change-status/:id
export const changesStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status
        })

        res.json({
            code: 200,
            message: "update success"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "update fail"
        })
    }
}