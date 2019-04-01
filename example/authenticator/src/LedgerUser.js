import { User } from 'universal-authenticator-library'

export class LedgerUser extends User {

  /**
   * @param transaction  The transaction to be signed (a object that matches the RpcAPI structure).
   */
  async signTransaction(transaction, config) {}


  /**
   * @param publicKey   The public key to use for signing.
   * @param data        The data to be signed.
   * @param helpText    Help text to explain the need for arbitrary data to be signed.
   *
   * @returns           The signature
   */
  async signArbitrary(publicKey, data, helpText) {}

  /**
   * @param challenge   Challenge text sent to the authenticator.
   *
   * @returns           Whether the user owns the private keys corresponding with provided public keys.
   */
  async verifyKeyOwnership(challenge) {}

  async getAccountName() {}

  async getChainId() {}

  async getKeys() {}
}