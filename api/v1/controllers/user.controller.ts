import {Request, Response} from 'express';
import md5 from 'md5';
import User from '../models/user.model';
import { generateRandomString } from '../../../helpers/generate';

// [POST] api/v1/users/register
export const register = async (req: Request, res: Response) => {
    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (emailExist) {
        return res.json({
            code: 400,
            message: "email exist"
        })
    }

    req.body.password = md5(req.body.password);
    req.body.token = generateRandomString(30);

    const user = await User.create(req.body);

    const token = user.token;

    res.json({
        code: 200,
        message: "register success",
        data: {
            token
        }
    })
}

// [POST] api/v1/users/login
export const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email,
        deleted: false
    })

    if (!user) {
        return res.json({
            code: 400,
            message: "email not exist"
        })
    }

    if (user.password !== password) {
        return res.json({
            code: 400,
            message: "password wrong"
        })
    }

    const token = user.token;

    res.json({
        code: 200,
        message: "login success",
        data: {
            token
        }
    })
}

// [GET] api/v1/users/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const user = await User.findOne({
        _id: id,
        deleted: false
    }).select("-password -token -deleted -deletedAt -createdAt -updatedAt");

    res.json({
        code: 200,
        message: "success",
        info: user
    })
}