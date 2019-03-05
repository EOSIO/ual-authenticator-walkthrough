import { SignatureProvider } from '@blockone/eosjs-ledger-signature-provider'
import { User } from '@blockone/universal-authenticator-library'
import { Api, JsonRpc } from 'eosjs'
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from 'text-encoding'

import { UALLedgerError } from './UALLedgerError'

export class LedgerUser extends User {
  api = null
  rpc = null
  signatureProvider
  textEncoder
  textDecoder

  constructor(chain, accountName, requestPermission) {
    super()
    if (typeof(TextEncoder) !== 'undefined') {
      this.textEncoder = TextEncoder
      this.textDecoder = TextDecoder
    } else {
      this.textEncoder = NodeTextEncoder
      this.textDecoder = NodeTextDecoder
    }
  }

  async init() {
    this.signatureProvider = new SignatureProvider()
    const rpcEndpoint = this.chain.rpcEndpoints[0]
    const rpcEndpointString = `${rpcEndpoint.protocol}://${rpcEndpoint.host}:${rpcEndpoint.port}`
    this.rpc = new JsonRpc(rpcEndpointString)
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider: this.signatureProvider,
      textEncoder: new this.textEncoder(),
      textDecoder: new this.textDecoder(),
    })
  }

  async signTransaction(
    transaction,
    { broadcast = true, blocksBehind = 3, expireSeconds = 30 }
  ) {
    try {
      const completedTransaction = this.api && await this.api.transact(
        transaction,
        { broadcast, blocksBehind, expireSeconds }
      )
      return this.returnEosjsTransaction(broadcast, completedTransaction)
    } catch (e) {
      const message = e.message ? e.message : 'Unable to sign transaction'
      const type = UALErrorType.Signing
      const cause = e
      throw new UALLedgerError(message, type, cause)
    }
  }

  async signArbitrary() {
    throw new UALLedgerError(
      `${Name} does not currently support signArbitrary`,
      UALErrorType.Unsupported,
      null)
  }

  async verifyKeyOwnership() {
    throw new UALLedgerError(
      `${Name} does not currently support verifyKeyOwnership`,
      UALErrorType.Unsupported,
      null)
  }

  async getAccountName() {
    return this.accountName
  }

  async getChainId() {
    return this.chain.chainId
  }

  async getKeys() {
    try {
      const keys = await this.signatureProvider.getAvailableKeys(this.requestPermission)
      return keys
    } catch (error) {
      const message = `Unable to getKeys for account ${this.accountName}.
        Please make sure your ledger device is connected and unlocked`
      const type = UALErrorType.DataRequest
      const cause = error
      throw new UALLedgerError(message, type, cause)
    }
  }

  async isAccountValid() {
    try {
      const account = this.rpc && await this.rpc.get_account(this.accountName)
      const actualKeys = this.extractAccountKeys(account)
      const authorizationKeys = await this.getKeys()

      return actualKeys.filter((key) => {
        return authorizationKeys.indexOf(key) !== -1
      }).length > 0
    } catch (e) {
      if (e.constructor.name === 'UALLedgerError') {
        throw e
      }

      const message = `Account validation failed for account ${this.accountName}.`
      const type = UALErrorType.Validation
      const cause = e
      throw new UALLedgerError(message, type, cause)
    }
  }

  extractAccountKeys(account) {
    const keySubsets = account.permissions.map((permission) => permission.required_auth.keys.map((key) => key.key))
    let keys = []
    for (const keySubset of keySubsets) {
      keys = keys.concat(keySubset)
    }
    return keys
  }
}