import express, { Request, Response, NextFunction} from "express";
import { ErrorResponse, Status, SuccessResponse } from "../../helpers/response";
import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { handleResponse } from "..";
import jwt from "jsonwebtoken";
import { PolicyEntity } from "./entities/policy";
import { PolicyService } from "./service";
import { PolicyController } from "./controller";
import { FetchPartnerPoliciesDto } from "./dto/fetch-partner-policies.dto";
import { auth, InvalidTokenError, requiredScopes } from 'express-oauth2-jwt-bearer';

const router = express.Router();

const policyEntity = new PolicyEntity()
const policyService = new PolicyService(policyEntity);
const policyController = new PolicyController(policyService);


const jwtCheck = auth({
    audience: process.env.ACCESS_API_AUTH_AUDIENCE,
    issuerBaseURL: process.env.ACCESS_API_AUTH_ISSUER_URL,
    tokenSigningAlg: process.env.ACCESS_API_AUTH_TOKEN_ALG,
    jwksUri: `${process.env.ACCESS_API_AUTH_ISSUER_URL}.well-known/jwks.json`
});

router.get('/partner/:id', ((req, res, next) => {
    const headers = req.headers;
    const auth = headers.authorization;
    console.log("KKK: ", auth);
    if (auth) {
        const token = auth.split(' ')[1];
        if (token) {
            console.log(jwt.decode(token))
        } 
    }
    console.log("Auth : ", headers, req.params);
    next()
}), jwtCheck, requiredScopes('read:policies'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const key = req.query["key"] as string;
        const response = await policyController.fetchPartnerPolices(new FetchPartnerPoliciesDto(id, key));
        return handleResponse(response, res);
    } catch (error) {
        console.error("Err: ", error);
        return handleResponse(error as ErrorResponse, res);
    } 
})

router.get('/partner', async (req: Request, res: Response) => {
    try { 
        return handleResponse(new SuccessResponse({}, "cool"), res);
    } catch (error) {
        return handleResponse(error as ErrorResponse, res);
    } 
})

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof InvalidTokenError) {
        console.error("ff sup: ", err);
        return handleResponse(new ErrorResponse(err.message, HttpStatusCode.UNAUTHORIZED), res);
    }
    console.error("ff sup: ", err);
    res.status(500).send('Something broke!')
  })


export default router;