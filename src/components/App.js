import React, { Component } from 'react';
import Web3 from 'web3';

const Matic = require('@maticnetwork/maticjs').default
const config = require('./config.json')

const matic = new Matic({
  maticProvider: config.MATIC_PROVIDER,
  parentProvider: window.ethereum
})


const token = "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b" // ERC721 token address
const tokenId = '100' // ERC721 token ID

const from = "0x720E1fa107A1Df39Db4E78A3633121ac36Bec132"


class App extends Component {

  
  
async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

  }


  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
    console.log(ethBalance);

    // Load Token
    const networkId =  await web3.eth.net.getId()

  }
  

  async execute() {
    await matic.initialize()
    //matic.setWallet("PRIVATE_KEY")
    // Depsoit NFT Token
    let response = await matic.safeDepositERC721Tokens(token,tokenId,{ from, gasPrice: '10000000000' })
    console.log(response);
    return response;
} 
  
  render() {
    return (
      <div>

      <button onClick={this.execute()}></button>
      </div>
    );
  }
}

export default App;


