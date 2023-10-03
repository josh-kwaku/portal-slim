import express, { Response, Request, NextFunction } from "express";
import { AppResponse, SuccessResponse, Status } from "../helpers/response";
import { HttpStatusCode } from "../helpers/httpStatusCodes"
import policy from "./policy";

const router = express.Router();

const BASE_ROUTE_MESSAGE = "Healthy"

export const handleResponse = function(
    response: AppResponse,
    res: Response<any>,
  ) {
    let resp = Object.assign({}, response);
    delete resp.httpCode;
    res.status(response.httpCode as number).json(resp)
  };

router.get('/', (req: Request, res: Response) => {
    return handleResponse(new SuccessResponse({}, BASE_ROUTE_MESSAGE, HttpStatusCode.OK), res);
});

router.use('/policy', policy);

export default router;