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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changesStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = __importDefault(require("../../../helpers/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    if (req.query.status) {
        find['status'] = req.query.status.toString();
    }
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toString()] = req.query.sortValue.toString();
    }
    let objectSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    const initPagination = {
        currentPage: 1,
        limitItems: 2
    };
    const countTask = yield task_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.default)(initPagination, req.query, countTask);
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .skip(objectPagination.skip)
        .limit(objectPagination.limitItems);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findOne({
        _id: id,
        deleted: false
    });
    res.json(task);
});
exports.detail = detail;
const changesStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({
            _id: id
        }, {
            status: status
        });
        res.json({
            code: 200,
            message: "update success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "update fail"
        });
    }
});
exports.changesStatus = changesStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const key = req.body.key;
        const value = (_a = req.body) === null || _a === void 0 ? void 0 : _a.value;
        switch (key) {
            case Key.STATUS:
                yield task_model_1.default.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: value
                });
                break;
            case Key.DELETE:
                yield task_model_1.default.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                break;
            default:
                break;
        }
        res.json({
            code: 200,
            message: "update success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "update fail"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield task_model_1.default.create(req.body);
        res.json({
            code: 200,
            message: "create success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "create fail"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id
        }, req.body);
        res.json({
            code: 200,
            message: "update success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "update fail"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.findOneAndUpdate({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "delete success"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "delete fail"
        });
    }
});
exports.deleteTask = deleteTask;
