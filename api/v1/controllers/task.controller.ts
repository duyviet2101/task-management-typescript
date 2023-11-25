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

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        enum Key {
            STATUS = 'status',
            DELETE = 'delete'
        }


        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body?.value;

        switch (key) {
            case Key.STATUS:
                await Task.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: value
                })
                break;
            case Key.DELETE:
                await Task.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                })
                break;
            default:
                break;
        }

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

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const product = await Task.create(req.body);

        res.json({
            code: 200,
            message: "create success"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "create fail"
        })
    }
}

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;

        await Task.updateOne({
            _id: id
        }, req.body)

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

// [DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;

        await Task.findOneAndUpdate({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        })

        res.json({
            code: 200,
            message: "delete success"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "delete fail"
        })
    }
}