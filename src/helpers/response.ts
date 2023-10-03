import { HttpStatusCode } from "./httpStatusCodes";

export enum Status {
    ERROR = "error",
    SUCCESS = "success"
}

export interface AppResponse {
    message?: string;
    data?: any;
    httpCode?: number | null;
}

export class SuccessResponse implements AppResponse {
    status: Status
    data?: any;
    httpCode?: number;
    message?: string

    constructor(data: any, message: string, httpCode: number = HttpStatusCode.OK) {
        this.status = Status.SUCCESS;
        this.data = data;
        this.httpCode = httpCode;
        this.message = message
    }
}

export class ErrorResponse implements AppResponse {
    status: Status
    httpCode?: number | null;
    message: string;
    data?: any;
    constructor(message: string, httpCode?: number | null, data?: any) {
        this.status = Status.ERROR;
        this.message = message;
        this.httpCode = httpCode;
        this.data = data || null;
    }
}