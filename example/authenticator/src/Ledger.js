import { Authenticator, UALLoggedInAuthType, UALAccountName, UALErrorType } from '@blockone/universal-authenticator-library'
import { LedgerUser } from './LedgerUser'

import { UALLedgerError } from './UALLedgerError'
import { Logo } from './logo'

export class Ledger extends Authenticator {
  onBoardingLink = 'https://www.ledger.com'
  users = []
  error = null
  chains
  options

  constructor(chains, options) {
    super(chains, options)
    this.chains = chains
  }

  async init() {}

  reset() {}

  isErrored() {
    return false
  }
  
  getOnboardingLink() {
    return this.onBoardingLink
  }

  getError() {
    return null
  }

  isLoading() {
    return false
  }

  getStyle() {
    return {
      icon: Logo,
      text: 'Ledger',
      textColor: '#FFFFFF',
      background: '#44bdbd',
    }
  }

  shouldRender() {
    if (window.location.protocol !== 'https:') {
      return false
    }

    return true
  }

  shouldAutoLogin() {
    return false
  }

  async shouldRequestAccountName() {
    return true
  }

  async login(accountName) {
    for (const chain of this.chains) {
      const user = new LedgerUser(chain, accountName, this.requiresGetKeyConfirmation(accountName))
      await user.init()
      const isValid = await user.isAccountValid()
      if (!isValid) {
        const message = `Error logging into account "${accountName}"`
        const type = UALErrorType.Login
        const cause = null
        throw new UALLedgerError(message, type, cause)
      }
      this.users.push(user)
    }

    return this.users 
  }

  async logout() {
    try {
      for (const user of this.users) {
        user.signatureProvider.cleanUp()
        user.signatureProvider.clearCachedKeys()
      }
      this.users = []
    } catch (e) {
      const message = 'Error logging out'
      const type = UALErrorType.Logout
      const cause = e
      throw new UALLedgerError(message, type, cause)
    } 
  }

  requiresGetKeyConfirmation(accountName) {
    if (!accountName) {
      return true
    }

    const type = window.localStorage.getItem(UALLoggedInAuthType)
    const account = window.localStorage.getItem(UALAccountName)
    if (account === accountName && type === 'Ledger') {
      return false
    }

    return true
  }
}