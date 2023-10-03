export class FetchPartnerPoliciesDto {
    partnerId: string;
    partnerKey: string;
    constructor(id: string, key: string) {
        this.partnerId = id;
        this.partnerKey = key;
    }
}