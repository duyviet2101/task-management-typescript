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