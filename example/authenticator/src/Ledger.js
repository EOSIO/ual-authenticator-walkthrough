import { Authenticator } from '@blockone/universal-authenticator-library'
import { LedgerUser } from './LedgerUser'

export class Ledger extends Authenticator {
  onBoardingLink = 'https://www.ledger.com/pages/ledger-live'
  users = []
  error = null
  chains
  options

  constructor(chains, options) {
    super(chains, options)
    this.chains = chains
  }

  async init() {
    console.info('Initialized!')
  }

  reset() {
    return
  }

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
      icon: 'TODO',
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
      const message = CONSTANTS.logoutMessage
      const type = UALErrorType.Logout
      const cause = e
      throw new UALLedgerError(message, type, cause)
    } 
  }

  requiresGetKeyConfirmation() {
    if (!accountName) {
      return true
    }

    const type = window.localStorage.getItem(UALLoggedInAuthType)
    const account = window.localStorage.getItem(UALAccountName)
    if (account === accountName && type === Name) {
      return false
    }

    return true
  }
}