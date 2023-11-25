"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generate_1 = require("../../../helpers/generate");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExist = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        return res.json({
            code: 400,
            message: "email exist"
        });
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    req.body.token = (0, generate_1.generateRandomString)(30);
    const user = yield user_model_1.default.create(req.body);
    const token = user.token;
    res.json({
        code: 200,
        message: "register success",
        data: {
            token
        }
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = (0, md5_1.default)(req.body.password);
    const user = yield user_model_1.default.findOne({
        email,
        deleted: false
    });
    if (!user) {
        return res.json({
            code: 400,
            message: "email not exist"
        });
    }
    if (user.password !== password) {
        return res.json({
            code: 400,
            message: "password wrong"
        });
    }
    const token = user.token;
    res.json({
        code: 200,
        message: "login success",
        data: {
            token
        }
    });
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        code: 200,
        message: "success",
        info: req["user"]
    });
});
exports.detail = detail;
