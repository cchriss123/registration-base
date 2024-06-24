import bodyParser from 'body-parser';
import express, {NextFunction} from "express";


interface ErrorWithStatus extends Error {
    status?: number;
}

function handleJsonParseError(err: ErrorWithStatus, next: NextFunction, res: express.Response) {
    if (!err)
        return next();

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(`Bad JSON: ${err.message}`);
        return res.status(400).json({ error: err.message });
    }
    return next(err);
}

export function customJsonParser(req : express.Request, res : express.Response, next : NextFunction) {
    bodyParser.json()(req, res, (err : ErrorWithStatus) => handleJsonParseError(err, next, res));
}

exports.customJsonParser = customJsonParser;
