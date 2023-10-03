import { default as sq, Sequelize, UpdateOptions } from 'sequelize'

import { PolicyCancellationReason, PolicyStatus } from '@alteos/common'
import {
  CustomerType,
  PremiumCalculationType,
  TestingFlag
} from '@alteos/dictionaries'
import {
  IPaymentAmount,
  IPolicyCancellationData,
  IPolicyCollectionData,
  IPolicyInvoicingData,
  IPolicyObligationData
} from '@alteos/policy-client'
import { ITax } from '@alteos/search-client'

import { IValues, IMetadata } from '../../policy/interfaces'
import {
  ACTIVATION_CODE_LENGTH,
  CANCELLATION_REASON_LENGTH,
  POLICY_MODEL_NAME,
  POLICY_STATUS_LENGTH,
  PRETTY_ID_COLUMN_LENGTH,
  PRODUCT_VERSION_LENGTH
} from '../constants'

// Keep these models in sync with the ones from the Search service

export interface Policy {
  id: string
  prettyId: string
  productId: string
  productVersion: string
  partnerId: string
  referralPartnerId: string | null
  customerId: string
  activationCode?: string
  status: PolicyStatus
  paymentData: IPolicyPaymentData
  accountingData: IPolicyAccountingData
  obligationData: IPolicyObligationData
  collectionData: IPolicyCollectionData
  invoicingData: IPolicyInvoicingData
  cancellationData: IPolicyCancellationData
  cancellationReason: PolicyCancellationReason
  withdrawalReason: PolicyCancellationReason
  cancellationRequestedAt: Date | string | null
  withdrawalRequestedAt: Date | string | null
  effectiveAt: Date | string | null
  effectiveRequestedAt: Date | string | null
  data: IPolicyData
  customer: IPolicyCustomer
  metadata: IMetadata
  testingFlags: TestingFlag[]
  issuedAt: Date | string | null
  boundAt: Date | string | null
  startsAt: Date | string
  endsAt: Date | string
  createdBy: string | null
  createdAt: Date | string
  updatedAt: Date | string
  cancelledAt: Date | string | null
  expiredAt: Date | string | null
  withdrawnAt: Date | string | null
  discounts: IPolicyDiscount[]
  quoteId: string | null
  update: IUpdateFunction
  commissions: IPolicyCommission[] | null
}

export interface IPolicyData {
  [key: string]: any
  addons?: IPolicyAddon[]
  package?: IPolicyPackage
  values: IValues
  objects: IPolicyObject[]
  taxes: ITax[]
  device?: IPolicyDevice
}

export interface IPolicyDevice {
  partnerId: string
  id: string
  activationDate: string
  activatedAt: string
}

export interface IPolicyDiscount {
  code: string
  rate: number | null
  type: string
  isSubjectForAccounting: boolean
}

export interface IPolicyPaymentData {
  calculationType?: PremiumCalculationType
  premium: number
  taxes: number
  gross: number
  taxRate: number
  billableDuration?: string
  annualPremium?: number
  annualTax?: number
  annualPremiumExclDiscounts?: number
  annualTaxExclDiscounts?: number
  premiumExclDiscounts: number
  taxesExclDiscounts: number
  grossExclDiscounts: number
  discountRate?: number
  marketingDiscounts?: IPaymentAmount
  contractValue: IPaymentAmount
}

export interface IPolicyAccountingData {
  premium: number
  taxes: number
  gross: number
}

export interface IPolicyCommission {
  name: string
  amount: number
  rate: number
}

export interface IPolicyObject {
  name: string
  values: IValues
  risks: IPolicyRisk[]
  coverageStartsAt: string | Date
  coverageEndsAt: string | Date
  premium?: number
}

export interface IPolicyAddonPayment {
  premium: number
  tax: number
}

export interface IPolicyAddon {
  name: string
  payments: IPolicyAddonPayment[]
}

export interface IPolicyPackagePayment {
  premium: number
  tax: number
}

export interface IPolicyPackage {
  name: string
  payments: IPolicyPackagePayment[]
}

export interface IPolicyRisk {
  name: string
  values: IValues
  premium?: number
  deductiblePerContract?: number
  deductiblePerYear?: number
  deductiblePerIncident?: number
  sumInsuredPerContract?: number
  sumInsuredPerYear?: number
  sumInsuredPerIncident?: number
}

export interface IPolicyCustomer {
  type: CustomerType
  email: string
  lastName: string
  firstName: string
  phone?: string
  values: IValues
}

type IUpdateFunction = (
  updates: Partial<Policy>,
  options: UpdateOptions
) => Promise<Policy>

export function dbSetupPolicyModel(dbClient: Sequelize): void {
  dbClient.define(
    POLICY_MODEL_NAME,
    {
      id: {
        type: sq.UUID,
        defaultValue: sq.UUIDV4,
        primaryKey: true
      },
      prettyId: {
        type: sq.STRING(PRETTY_ID_COLUMN_LENGTH),
        allowNull: false,
        unique: true
      },
      productId: {
        type: sq.UUID,
        allowNull: false
      },
      productVersion: {
        type: sq.STRING(PRODUCT_VERSION_LENGTH),
        allowNull: false
      },
      partnerId: {
        type: sq.UUID,
        allowNull: false
      },
      referralPartnerId: {
        type: sq.UUID,
        allowNull: true
      },
      customerId: {
        type: sq.UUID,
        allowNull: false
      },
      activationCode: {
        type: sq.STRING(ACTIVATION_CODE_LENGTH),
        allowNull: true
      },
      status: {
        type: sq.STRING(POLICY_STATUS_LENGTH),
        allowNull: false
      },
      cancellationReason: {
        type: sq.STRING(CANCELLATION_REASON_LENGTH),
        allowNull: true
      },
      withdrawalReason: {
        type: sq.STRING(CANCELLATION_REASON_LENGTH),
        allowNull: true
      },
      paymentData: {
        type: sq.JSONB,
        allowNull: false
      },
      accountingData: {
        type: sq.JSONB,
        allowNull: true
      },
      obligationData: {
        type: sq.JSONB,
        allowNull: true
      },
      collectionData: {
        type: sq.JSONB,
        allowNull: true
      },
      invoicingData: {
        type: sq.JSONB,
        allowNull: true
      },
      cancellationData: {
        type: sq.JSONB,
        allowNull: true
      },
      data: {
        type: sq.JSONB,
        allowNull: false
      },
      customer: {
        type: sq.JSONB,
        allowNull: false
      },
      metadata: {
        type: sq.JSONB,
        allowNull: false
      },
      testingFlags: {
        type: sq.ARRAY({ type: sq.STRING }),
        allowNull: false
      },
      createdAt: {
        type: sq.DATE,
        allowNull: false,
        defaultValue: sq.literal('NOW()')
      },
      createdBy: {
        type: sq.UUID,
        allowNull: true
      },
      updatedAt: {
        type: sq.DATE,
        allowNull: false,
        defaultValue: sq.literal('NOW()')
      },
      issuedAt: {
        type: sq.DATE,
        allowNull: true
      },
      boundAt: {
        type: sq.DATE,
        allowNull: true
      },
      cancelledAt: {
        type: sq.DATE,
        allowNull: true
      },
      expiredAt: {
        type: sq.DATE,
        allowNull: true
      },
      withdrawnAt: {
        type: sq.DATE,
        allowNull: true
      },
      cancellationRequestedAt: {
        type: sq.DATE,
        allowNull: true
      },
      effectiveAt: {
        type: sq.DATE,
        allowNull: true
      },
      effectiveRequestedAt: {
        type: sq.DATE,
        allowNull: true
      },
      withdrawalRequestedAt: {
        type: sq.DATE,
        allowNull: true
      },
      startsAt: {
        type: sq.DATE,
        allowNull: false
      },
      endsAt: {
        type: sq.DATE,
        allowNull: false
      },
      discounts: {
        type: sq.JSONB,
        allowNull: true
      },
      quoteId: {
        type: sq.STRING,
        allowNull: true
      },
      commissions: {
        type: sq.JSONB,
        allowNull: true
      }
    },
    {
      tableName: 'policies',
      timestamps: true
    }
  )
}
