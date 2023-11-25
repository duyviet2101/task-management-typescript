import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        if (!req.headers.authorization) {
            return res.json({
                code: 404,
                message: 'Not found'
            })
        }

        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token,
            deleted: false
        }).select('-password -token -__v -deleted')
        if (!user) {
            return res.json({
                code: 400,
                message: 'Account invalid'
            })
        }

        req['user'] = user

        next()
    } catch (error) {
        return res.json({
            code: 404,
            message: error
        })
    }
}