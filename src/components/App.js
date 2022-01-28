import React, { Component } from "react";
import Web3 from "web3";
import MetamaskProvider from "@maticnetwork/metamask-provider";
//import Matic from "@maticnetwork/maticjs";
import { use, POSClient } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'
const bn = require("bn.js");
const Network = require("@maticnetwork/meta/network");
const SCALING_FACTOR = new bn(10).pow(new bn(18));
//const token = "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b" // ERC721 token address
//const tokenId = '100' // ERC721 token ID
const from = "0x82Bd99BF8c02b28157a9D9B11f19B05C331b9259";

// install web3 plugin
use(Web3ClientPlugin);

const { ETHEREUM_YUP_TOKEN, POLYGON_YUP_TOKEN } = process.env

class App extends Component {
  state = {
    hash: "",
  };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    console.log(accounts[0]);

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    console.log(ethBalance);

    const networkId = await web3.eth.net.getId();
    console.log(networkId);
  }

  async getMaticClient(_network = "testnet", _version = "mumbai") {
    const posClient = new POSClient();
    const network = new Network(_network, _version);

    console.log(
      posClient.init({
        network: network,
        version: _version,
        parent: {
          provider: new MetamaskProvider(window.ethereum, {
            url: "https://goerli.infura.io/v3/72a742010b8c4a2ba7f0398c65bdeb63",
          }),
          defaultConfig: {
            from: from,
          },
        },
        child: {
          provider: new MetamaskProvider(window.ethereum, {
            url: "https://rpc-mumbai.matic.today",
          }),
          defaultConfig: {
            from: from,
          },
        },
      })
    );

   return posClient.init({
      network: network,
      version: _version,
      parent: {
        provider: new MetamaskProvider(window.ethereum, {
          url: "https://goerli.infura.io/v3/72a742010b8c4a2ba7f0398c65bdeb63",
        }),
        defaultConfig: {
          from: from,
        },
      },
      child: {
        provider: new MetamaskProvider(window.ethereum, {
          url: "https://rpc-mumbai.matic.today",
        }),
        defaultConfig: {
          from: from,
        },
      },
    });
  }



  async approve() {
    const client = await this.getMaticClient();
    const erc20Token = client.erc20(ETHEREUM_YUP_TOKEN, true);
   const result = await erc20Token.approve(100);
   console.log(result);
     const txHash = await result.getTransactionHash();
     console.log(txHash);
   const receipt = await result.getReceipt();
   console.log(receipt);

  }


  async deposit() {
    const client = await this.getPOSClient();
    const erc20Token = client.erc20(ETHEREUM_YUP_TOKEN, true);
  
    const result = await erc20Token.deposit(100,from);
    console.log(result);
    const txHash = await result.getTransactionHash();
    console.log(txHash);
  const receipt = await result.getReceipt();
  console.log(receipt);
  
  }

    
  async burn() {
    const client = await this.getPOSClient();
    const erc20Token = client.erc20(POLYGON_YUP_TOKEN);
  
    const result = await erc20Token.withdrawStart(100);
  
    const txHash = await result.getTransactionHash();
    console.log(txHash);
  const receipt = await result.getReceipt();
  console.log(receipt);
  }

  async exit(){
    const client = await this.getPOSClient();
    const erc20Token = client.erc20(ETHEREUM_YUP_TOKEN, true);
  
    const result = await erc20Token.withdrawExit(txHash);
  
    const txHash = await result.getTransactionHash();
    console.log(txHash);
  const receipt = await result.getReceipt();
  console.log(receipt);
  
  }



  render() {
    return (
      <div>
        <button onClick={() => this.approve()}>Approve</button>
        <br></br>
        <h1>{this.state.hash}</h1>
        <a
          href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem(
            "hash"
          )}/token_transfers`}
          target="_blank"
        >
          Hash
        </a>
        <br></br>
        <button onClick={() => this.deposit()}>Deposit</button>
        <br></br>
        <a
          href={`https://goerli.etherscan.io/tx/${localStorage.getItem(
            "chash"
          )}`}
          target="_blank"
        >
          Hash
        </a>
        <br></br>

        <button onClick={() => this.burn()}>Burn</button>
        <br></br>
        <a
          href={`https://goerli.etherscan.io/tx/${localStorage.getItem(
            "phash"
          )}`}
          target="_blank"
        >
          Hash
        </a>
        <br></br>

        <button onClick={() => this.exit()}>Exit</button>
        <br></br>
        <a
          href={`https://goerli.etherscan.io/tx/${localStorage.getItem(
            "dhash"
          )}`}
          target="_blank"
        >
          Hash
        </a>
        <br></br>
      </div>
    );
  }
}

export default App;
