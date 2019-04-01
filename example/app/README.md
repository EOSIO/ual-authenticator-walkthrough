# UAL Authenticator Walkthrough Example

This example implements a basic react app that utilizes [The UAL React Renderer](https://github.com/EOSIO/universal-authenticator-library) and the Ledger authenticator created during the tutorial. It will install and use the `Authenticator` in `example/authenticator` by default. 

### Setup

The example uses an environment configuration for the Chain and RPC endpoints. Update the values in the .env file you create below to set the preferred Chain you wish your app to transact on.

Create a `.env` file from the `default.env`
```bash
~ cp default.env .env
```

Follow the instructions [here](https://dashboard.ngrok.com/get-started) to install [ngrok](https://ngrok.com/)

### Running Frontend

```bash
~ yarn
~ yarn start
```

Lastly you will need to forward port 3000 with ngrok
