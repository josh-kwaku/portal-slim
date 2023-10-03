import { FetchPartnerPoliciesDto } from "./dto/fetch-partner-policies.dto";
import { PolicyEntity } from "./entities/policy";

export class PolicyService {
    constructor(private policyEntity: PolicyEntity) {}
    public async fetchPartnerPolices(data: FetchPartnerPoliciesDto) {
        return this.policyEntity.fetchPoliciesByPartnerId(data);
    }
}