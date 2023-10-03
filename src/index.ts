import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import Logger from "./helpers/logger";
import router, { handleResponse } from "./components";
import { ErrorResponse, Status } from "./helpers/response";
import { CommonErrors } from "./helpers/commonErrors";
import { HttpStatusCode } from "./helpers/httpStatusCodes";

const stream = {
    write: (text: string) => {
        Logger.info(text);
    }
}

const app: Express = express();

app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV === 'development')  app.use(morgan('tiny'));
else app.use(morgan('combined', { stream }));


app.use(bodyParser.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            Logger.error(err);
            return res.status(HttpStatusCode.BAD_REQUEST).send(handleResponse(new ErrorResponse(CommonErrors.INVALID_JSON_PAYLOAD, HttpStatusCode.BAD_REQUEST), res));
        }
        next();
    })
});

app.use(router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Something sup: ", err);
    res.status(500).send('Something broke!')
  })

export default app;