import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Ledger } from 'authenticator'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

const receiver = process.env.REACT_APP_TO
const getTransaction = (account) => ({
  actions: [{
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{ actor: account, permission: 'active' }],
    data: { from: account, to: receiver, quantity: '0.0001 EOS', memo: '' },
  }],
})

class TestApp extends Component {
  static propTypes = {
    ual: PropTypes.shape({
      activeUser: PropTypes.object,
      activeAuthenticator: PropTypes.object,
      logout: PropTypes.func,
      showModal: PropTypes.func,
    }).isRequired,
  }

  state = { message: '' }

  transfer = async () => {
    const { ual: { activeUser } } = this.props
    try {
      const accountName = await activeUser.getAccountName()
      const demoTransaction = getTransaction(accountName)
      const result = await activeUser.signTransaction(demoTransaction, { expireSeconds: 60, blocksBehind: 3 })
      this.setState({ message: `Transfer Successful!` }, () => {
        setTimeout(this.resetMessage, 5000)
      })
      console.info('SUCCESS:', result)
    } catch (e) {
      console.error('ERROR:', e)
    }
  }

  resetMessage = () => this.setState({ message: '' })

  renderLoggedInView = () => (
    <>
      {!!this.state.message
        && (
          <div style={styles.announcementBar}>
            <p style={styles.baseText}>{this.state.message}</p>
          </div>
        )
      }
      <button type='button' onClick={this.transfer} style={{ ...styles.button, ...styles.blueBG }}>
        <p style={styles.baseText}>{`Transfer 1 EOS`}</p>
      </button>
      <button type='button' onClick={this.props.ual.logout} style={styles.logout}>
        <p>Logout</p>
      </button>
    </>
  )

  renderLoginButton = () => (
    <button type='button' onClick={this.props.ual.showModal} style={styles.button}>
      <p style={[styles.buttonText, styles.baseText]}>LOGIN</p>
    </button>
  )

  render() {
    const { ual: { activeAuthenticator } } = this.props
    return (
      <div style={styles.container}>
        {activeAuthenticator ? this.renderLoggedInView() : this.renderLoginButton()}
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
  button: {
    padding: '10px 60px',
    backgroundColor: '#EA2E2E',
    textAlign: 'center',
    borderRadius: 5,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logout: {
    marginTop: 20,
  },
  baseText: {
    color: '#fff',
    fontSize: 18,
  },
  blueBG: {
    backgroundColor: '#447DD8',
  },
  announcementBar: {
    width: '100%',
    padding: '10px 50px 10px 20px',
    textAlign: 'center',
    backgroundColor: '#3de13d',
    top: 0,
    position: 'absolute',
    alignItems: 'center',
  },
}

const chainId = process.env.REACT_APP_CHAIN_ID
const rpcEndpoints = [{
  protocol: process.env.REACT_APP_PROTOCOL,
  host: process.env.REACT_APP_HOST,
  port: process.env.REACT_APP_PORT,
}]
const exampleNet = { chainId, rpcEndpoints }
const TestAppConsumer = withUAL(TestApp)
const ledger = new Ledger([exampleNet])

const App = () => (
  <UALProvider chains={[exampleNet]} authenticators={[ledger]} appName='Authenticator Test App'>
    <TestAppConsumer />
  </UALProvider>
)

export default App