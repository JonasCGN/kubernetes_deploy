import { Request, Response, NextFunction } from 'express';

export function jsonErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Body JSON mal formatado' });
  }
  next(err);
}