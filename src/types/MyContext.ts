import { Request, Response } from "express";
// import {Request} from '@types/express'
export interface MyContext {
  req: Request;
  res: Response;
}
