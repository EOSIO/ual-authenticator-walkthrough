# UAL Authenticator Tutorial

This tutorial was created to help developers build UAL Authenticators with the signing method of their choosing.

## Overview
A developer that wishes to add support for their authenticator to `UAL` must implement 2 classes. An `Authenticator` and a `User`.

The `Authenticator` class represents the business logic behind the renderer, handles login/logout functionality and initializes the `User` class.

Logging in returns 1 or more User objects. A `User` object provides the ability for an app developer to request the app `User` sign a transaction using whichever authenticator they selected when logging in.

## Getting Started

## **Step 1**: Project setup 
This part is entirely up to you however I will include basic set up instructions here for convience.

You will need to create a new npm project and add the required dependencies.

```bash
~ mkdir ual-ledger
~ cd ual-ledger
~ yarn eosjs@edge @blockone/universal-authenticator-library
```


At this point you should have a basic folder structure that looks like this.

![screenshot](./assets/step1.png)


## **Step 2**: Creating the abstract `Authenticator` and `User` classes

We need to implement the abstract `Authenticator` and `User` classes. Create 2 new files `src/Ledger.js` and `src/LedgerUser.js` with the contents below, you don't need the comments.

TODO: Note which methods are required

### `Ledger.js`
```javascript
// Ledger.js

export class Ledger extends Authenticator {
  /**
   * Called after `shouldRender` and should be used to handle any async actions required to initialize the authenticator
   */
  async init()


  /**
   * Resets the authenticator to its initial, default state then calls `init` method
   */
  reset()


  /**
   * Returns true if the authenticator has errored while initializing.
   */
  isErrored()
  

  /**
   * Returns a URL where the user can download and install the underlying authenticator
   * if it is not found by the UAL Authenticator.
   */
  getOnboardingLink()


  /**
   * Returns error (if available) if the authenticator has errored while initializing.
   */
  getError()


  /**
   * Returns true if the authenticator is loading while initializing its internal state.
   */
  isLoading()


  /**
   * Returns the style of the Button that will be rendered.
   */
  getStyle()


  /**
   * Returns whether or not the button should render based on the operating environment and other factors.
   * ie. If your Authenticator App does not support mobile, it returns false when running in a mobile browser.
   */
  shouldRender()


  /**
   * Returns whether or not the dapp should attempt to auto login with the Authenticator app.
   * Auto login will only occur when there is only one Authenticator that returns shouldRender() true and
   * shouldAutoLogin() true.
   */
  shouldAutoLogin()


  /**
   * Returns whether or not the button should show an account name input field.
   * This is for Authenticators that do not have a concept of account names.
   */
  async shouldRequestAccountName()


  /**
   * Login using the Authenticator App. This can return one or more users depending on multiple chain support.
   *
   * @param accountName  The account name of the user for Authenticators that do not store accounts (optional)
   */
  async login(accountName)
  

  /**
   * Logs the user out of the dapp. This will be strongly dependent on each Authenticator app's patterns.
   */
  public logout()


  /**
   * Returns true if user confirmation is required for `getKeys`
   */
  requiresGetKeyConfirmation()
}
```

### `LedgerUser.js`

```javascript
// LedgerUser.js

export class LedgerUser extends User {

  /**
   * @param transaction  The transaction to be signed (a object that matches the RpcAPI structure).
   */
  signTransaction(transaction, config)


  /**
   * @param publicKey   The public key to use for signing.
   * @param data        The data to be signed.
   * @param helpText    Help text to explain the need for arbitrary data to be signed.
   *
   * @returns           The signature
   */
  signArbitrary(publicKey, data, helpText)

  /**
   * @param challenge   Challenge text sent to the authenticator.
   *
   * @returns           Whether the user owns the private keys corresponding with provided public keys.
   */
  verifyKeyOwnership(challenge)

  getAccountName()

  getChainId()

  getKeys()
}
```

## **Step 3**: Implementing the `Authenticator` and `User` classes

The internal business logic of each Authenticator method will depend on the signing method you are using. You are free to do as you'd like as long as the input/return types match the abstract class it is implementing.

The major methods here are `init`, `login`, `logout` and `getStyle`.

* **`init()`** - Should be used to handle any async operations required to initialize the authenticator. `isLoading()` should return true until all async operations in `init` are complete and the authenticator is ready to accept method calls.
* **`login(accountName)`** - The implementation depends entirely on the signing method you are using and whether it supports multiple chains. You will need to create a new `User` class, verify the keys match the account provided, add the `User` to an array, and return the array of `User`'s. Otherwise throw an error with the appropriate messaging, this error will be displayed to the app user.
  #### Variations of `login()`
    * [ual-ledger](https://github.com/EOSIO/ual-ledger/blob/develop/src/Ledger.ts#L48) - Ledger requires an `accountName` and calls `requiresGetKeyConfirmation` to determine if the app user has already confirmed the public key from their ledger device. By calling `isAccountValid()` the authenticator utilizes the  [eosjs-ledger-signature-provider](https://github.com/EOSIO/private-eosjs-ledger-signature-provider) and communicates with the ledger device through the `U2F` protocol.
      ```javascript
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
      ```

  * [ual-scatter](https://github.com/EOSIO/ual-scatter/blob/develop/src/Scatter.ts#L91) - Scatter Desktop ?
      ```javascript
      async login() {
        try {
          for (const chain of this.chains) {
            const user = new ScatterUser(chain, this.scatter)
            await user.getKeys()
            this.users.push(user)
          }

          return this.users
        } catch (e) {
          throw new UALScatterError(
            'Unable to login',
            UALErrorType.Login,
            e)
        }
      }
      ```
  * [ual-lynx](https://github.com/EOSIO/ual-lynx/blob/develop/src/Lynx.ts#L102) - Lynx injects a `lynxMobile` object into the browsers global window, accessing that object we can all `requestSetAccount` and receive an object containing the account information of the account logged into the Lynx Wallet. 

    ```javascript
      async login() {
        if (this.users.length === 0) {
          try {
            const account = await window.lynxMobile.requestSetAccount()
            this.users.push(new LynxUser(this.chains[0], account))
          } catch (e) {
            throw new UALLynxError(
              'Unable to get the current account during login',
              UALErrorType.Login,
              e)
          }
        }

        return this.users
      }
    ```

* **`logout()`** - Responsible for terminating connections to external signing methods, if any exist and deleting user information that may have been cached in the `User` or `Authenticator` classes.
  #### Variations of `logout()`
  * [ual-ledger](https://github.com/EOSIO/ual-ledger/blob/develop/src/Ledger.ts#L65) - 
    ```javascript
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
    ```

  * [ual-scatter](https://github.com/EOSIO/ual-scatter/blob/develop/src/Scatter.ts#L108) - Calling `this.scatter.logout()` removes the `Identity` from scatter utilizing scatters built in method for logging out
    ```javascript
    async logout() {
      try {
        this.scatter.logout()
      } catch (error) {
        throw new UALScatterError('Error occurred during logout',
          UALErrorType.Logout,
          error)
      }
    }
    ```
   * [ual-lynx](https://github.com/EOSIO/ual-scatter/blob/develop/src/Scatter.ts#L108) - Since lynx does not provide a method of logging out we simple reinitilalize `this.users` to an empty array. This would require the app user to `login` again before a new `User` class is available.

      ```javascript
      async logout() {
        this.users = []
      }
      ```

### Below is a completed Ledger Authenticator

#### `Ledger.js`
```javascript
// Ledger.js
import { User } from '@blockone/universal-authenticator-library'
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
      icon: TODO,
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
```

#### LedgerUser.js
```javascript
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

```

