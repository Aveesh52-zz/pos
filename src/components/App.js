import React, { Component } from 'react';
import Web3 from 'web3';
import MetamaskProvider from "@maticnetwork/metamask-provider";
import Matic from "@maticnetwork/maticjs";
const bn = require("bn.js");
const Network = require("@maticnetwork/meta/network");
const SCALING_FACTOR = new bn(10).pow(new bn(18));
//const token = "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b" // ERC721 token address
//const tokenId = '100' // ERC721 token ID
const from = "0x720E1fa107A1Df39Db4E78A3633121ac36Bec132";

class App extends Component {


  state = {
     hash:""
  };
  
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
    
    console.log(accounts[0]);

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
    console.log(ethBalance);


    const networkId =  await web3.eth.net.getId();
    console.log(networkId);

  }
  
async getMaticClient(_network = "testnet", _version = "mumbai") {
 
  
console.log({ 
  network: _network,
  version: _version,
  parentProvider:new MetamaskProvider(window.ethereum, {
      url:"https://goerli.infura.io/v3/72a742010b8c4a2ba7f0398c65bdeb63"
    }),
  maticProvider:new MetamaskProvider(window.ethereum, {
      url:"https://rpc-mumbai.matic.today"
    }),  
  parentDefaultOptions: { from }, 
  maticDefaultOptions: { from },
}); 

  const network = new Network(_network, _version);
  const matic = new Matic({
    network: _network,
    version: _version,
    //parentProvider: "https://goerli.infura.io/v3/8759fde372ab4411871ce0005109ee20" ,
    //maticProvider: window.ethereumm ,
    parentProvider:new MetamaskProvider(window.ethereum, {
        url:"https://goerli.infura.io/v3/72a742010b8c4a2ba7f0398c65bdeb63"
      }),
    maticProvider:new MetamaskProvider(window.ethereum, {
        url:"https://rpc-mumbai.matic.today"
      }),  
    parentDefaultOptions: { from }, 
    maticDefaultOptions: { from },
  });
  await matic.initialize();
 
  return { matic, network };
  }


async burned() {

    const { matic, network } = await this.getMaticClient();
    console.log(matic);
    console.log(network);
    // burning erc721 tokens are also supported
    const token = "0x21C5111620aEd2Fe7885c96C4b72fBf89095A085";
    console.log(token);
  
    // or provide the tokenId in case of an erc721
    const tokenId = "7228";
    const hash = await matic.startWithdrawForNFT(token, tokenId, { from });
    await this.setState({
       hash:hash.transactionHash
    });
    console.log(hash.transactionHash);
    console.log(this.state.hash);
    localStorage.setItem('hash',this.state.hash);
    
  }

async withdrawn() {
  const hash1 = localStorage.getItem('hash');
  console.log(hash1);  
  const { matic, network } = await this.getMaticClient();
   
    // provide the burn tx hash
   
   const chash = await matic.withdrawNFT(hash1, { from, gas: "2000000" });
   console.log(chash.transactionHash);
   localStorage.setItem('chash',chash.transactionHash);
  }


  // Withdraw process is completed, funds will be transfered to your account after challege period is over.

async exit() {
    const { matic, network } = await this.getMaticClient();
    
    const token = network.Main.Contracts.Tokens.RootERC721;
   const phash = await matic.processExits(token, { from, gas: 7000000 })
   console.log(phash.transactionHash);
   localStorage.setItem('phash',phash.transactionHash);
  }
  
  async deposited() {
    const { matic, network } = await this.getMaticClient();
  
    const token = network.Main.Contracts.Tokens.RootERC721;
    console.log(token);
    const tokenId = "245";
  
    
    await matic.approveERC20TokensForDeposit(token, tokenId).then((res) => {
      console.log("approve hash: ", res.transactionHash);
    });
  

    await matic.safeDepositERC721Tokens(token, tokenId, { from }).then((res) => {
      console.log("desposit hash: ", res.transactionHash);
    });
  }
  
  
render() {
    return (
      <div>
      <button onClick={() => this.burned()}>Burn</button><br></br>
      <h1>{this.state.hash}</h1>
      <a href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem('hash')}/token_transfers`} target="_blank">Hash</a><br></br>
      <button onClick={() => this.withdrawn()}>Confirm Withdraw</button><br></br>
      <a href={`https://goerli.etherscan.io/tx/${localStorage.getItem('chash')}`} target="_blank">Hash</a><br></br>
      
      <button onClick={() => this.exit()}>Process Exit</button><br></br>
      <a href={`https://goerli.etherscan.io/tx/${localStorage.getItem('phash')}`} target="_blank">Hash</a><br></br>
      
      <button onClick={() => this.deposited()}>Deposit</button><br></br>
      <a href={`https://goerli.etherscan.io/tx/${localStorage.getItem('dhash')}`}  target="_blank">Hash</a><br></br>
      
      </div>
    );
  } 
}

export default App;

