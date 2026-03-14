"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonErrorHandler = jsonErrorHandler;
function jsonErrorHandler(err, req, res, next) {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Body JSON mal formatado' });
    }
    next(err);
}
