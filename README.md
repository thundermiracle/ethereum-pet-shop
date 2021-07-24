# pet shop's tutorial

for study ethereum & solidity

## How to make it work

1. Install Ganache & make a `QuickStart` workspace
    - Download from [here](https://www.trufflesuite.com/ganache) and install
    - Make a quickstart workspace
1. Install Metamask
    https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
1. Connect Metamask to Ganache
    - Create a new network
      - Network Name: localhost:7545
      - RPC URL: http://127.0.0.1:7545
      - Chain ID: 1337
      - Save
    - Select `localhost:7545` and all accounts will be listed
1. Install npm packages
    ```shell
    yarn
    ```
1. Deploy smart contract
    ```shell
    # to localhost:7545
    yarn deploy

    # to rinkeby
    yarn deploy --network rinkeby
    ```
1. Start web server & check http://localhost:3000
    ```shell
    yarn dev
    ```

## Rinkeby Transaction Hash

`0x5B7E70F2b01999Eaf5aE56c945281b9A66D3A0Ae`
