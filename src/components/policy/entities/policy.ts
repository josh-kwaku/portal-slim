import { Sequelize } from "sequelize";
import { DbClient } from "../../../database/sequelize";
import logger from "../../../helpers/logger";
import { POLICY_MODEL_NAME } from "../constants";
import { FetchPartnerPoliciesDto } from "../dto/fetch-partner-policies.dto";
import { dbSetupPolicyModel, Policy } from "../models/policy";

export class PolicyEntity {
    private _model;
    private _dbClient: Sequelize;
    constructor() {
        this._dbClient = DbClient.getInstance();
        dbSetupPolicyModel(this._dbClient);
        this._model = this._dbClient.model(POLICY_MODEL_NAME);
    }

    public async fetchPoliciesByPartnerId(data: FetchPartnerPoliciesDto): Promise<Policy[]> {
        try {
            let query: {where: {[key: string]: any}} = {
                where: { partnerId: data.partnerId}
            }
            if (data.partnerKey !== undefined && data.partnerKey !== '') {
                query.where["data.values.partnerKey"] = data.partnerKey
            }
            console.log("Query: ", query);
            return await this._model.findAll({ where: query.where }) as unknown as Policy[]
        } catch (error) {
            logger.error('error fetching partner policies', error);
            throw error;
        }
    }
}