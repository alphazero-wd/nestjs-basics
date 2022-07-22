import { json } from 'body-parser';
import { Response } from 'express';
import { RequestWithRawBody } from '../interfaces/request-with-raw-body.interface';

export const rawBodyMiddleware = () => {
  return json({
    verify: (req: RequestWithRawBody, _res: Response, buffer: Buffer) => {
      if (req.url === '/webhook' && Buffer.isBuffer(buffer)) {
        req.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
};
