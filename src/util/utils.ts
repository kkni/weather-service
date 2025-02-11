import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { z } from 'zod';

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // 에러를 next로 전달
  };
};


const validateRequestQuery = (schema: z.ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.query);
      req.query = result; // 검증 후 변환된 데이터를 저장
      next();
    } catch (err: any) {
      res.status(400).json({ error: err.errors });
    }
  };
};

const checkUserAgent = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.headers['user-agent'] || '';
  if (userAgent.includes('Formuler')) {
    next()
  } else {
    
    // logger.error(`Agent Error in ${req.method} ${req.url} ${req.headers['user-agent']}`)
    // res.status(httpStatus.BAD_REQUEST).json(
    //   (process.env.NODE_ENV) ? ErrorCodes.PARAMS_ERROR : ErrorCodes.USER_AGENT_ERROR.response)
  }
}

export { catchAsync, validateRequestQuery, checkUserAgent }