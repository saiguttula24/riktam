import { Request } from 'express';

export interface LocalsRequest extends Request {
    locals: any;
}