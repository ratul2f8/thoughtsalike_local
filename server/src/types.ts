import { Request, Response } from 'express';
import {Session} from 'express-session';
import { Redis } from "ioredis";
interface CustomProps{
    userId?: number
}
export type MyContext = {
    req: Request & { session: Session & CustomProps },
    redis: Redis,
    res: Response
}