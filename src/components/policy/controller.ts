import { HttpStatusCode } from "../../helpers/httpStatusCodes";
import { ErrorResponse, SuccessResponse } from "../../helpers/response";
import { FetchPartnerPoliciesDto } from "./dto/fetch-partner-policies.dto";
import { PolicyService } from "./service";

export class PolicyController {
    constructor(private policyService: PolicyService) {}

    async fetchPartnerPolices(data: FetchPartnerPoliciesDto) {
        try {
            const policies = await this.policyService.fetchPartnerPolices(data);
            return new SuccessResponse(policies, "partner policies fetched successfully")
        } catch (error) {
            console.error("Error: ", error);
            throw new ErrorResponse("error getting partner policies", HttpStatusCode.INTERNAL_SERVER_ERROR);
        } 
    }
}