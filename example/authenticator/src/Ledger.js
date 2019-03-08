import { Authenticator } from '@blockone/universal-authenticator-library'

export class Ledger extends Authenticator {
  /**
   * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
   */
  async init() {}


  /**
   * Resets the authenticator to its initial, default state then calls `init` method
   */
  reset() {}


  /**
   * Returns true if the authenticator has errored while initializing.
   */
  isErrored() {}
  

  /**
   * Returns a URL where the user can download and install the underlying authenticator
   * if it is not found by the UAL Authenticator.
   */
  getOnboardingLink() {}


  /**
   * Returns error (if available) if the authenticator has errored while initializing.
   */
  getError() {}


  /**
   * Returns true if the authenticator is loading while initializing its internal state.
   */
  isLoading() {}


  /**
   * Returns the style of the Button that will be rendered.
   */
  getStyle() {}


  /**
   * Returns whether or not the button should render based on the operating environment and other factors.
   * ie. If your Authenticator App does not support mobile, it returns false when running in a mobile browser.
   */
  shouldRender() {}


  /**
   * Returns whether or not the dapp should attempt to auto login with the Authenticator app.
   * Auto login will only occur when there is only one Authenticator that returns shouldRender() true and
   * shouldAutoLogin() true.
   */
  shouldAutoLogin() {}


  /**
   * Returns whether or not the button should show an account name input field.
   * This is for Authenticators that do not have a concept of account names.
   */
  async shouldRequestAccountName() {}


  /**
   * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
   *
   * @param accountName  The account name of the user for Authenticators that do not store accounts (optional)
   */
  async login(accountName) {}
  

  /**
   * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
   */
  async logout() {}


  /**
   * Returns true if user confirmation is required for `getKeys`
   */
  requiresGetKeyConfirmation() {}
}