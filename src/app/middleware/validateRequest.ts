import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import { ZodType } from "zod";


const validateRequestData = (schema: ZodType)=>{
  return (req: Request, res: Response, next: NextFunction)=>{
    try {
      const result = schema.safeParse(req.body);

    if(!result.success){
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: result.error.issues[0]?.message,
        error: result.error.issues,
      })
    };
    req.body = result.data; //replaces raw body data with validated data
    next();

    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

export default validateRequestData;