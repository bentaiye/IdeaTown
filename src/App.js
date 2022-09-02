
import './App.css';
import Home from './components/home';
import { Ideas } from './components/displayIdeas';
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import idea from "./contracts/idea.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;
const contractAddress = "0x83Cbf1fF158a8821628974b2d8ab97D86F4feF21";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [ideas, setIdeas] = useState([]);
  


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(idea, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  const getIdeas = useCallback(async () => {
    const ideasLength = await contract.methods.getIdeasLength().call();
    const ideas = [];
    for (let index = 0; index < ideasLength; index++) {
      let _ideas = new Promise(async (resolve, reject) => {
      let idea = await contract.methods.getIdea(index).call();

        resolve({
          index: index,
          owner: idea[0],
          name: idea[1],
          description: idea[2],
          perfect: idea[3],
          good: idea[4],
          bad: idea[5],
          noOfsupports: idea[6],
        });
      });
      ideas.push(_ideas);
    }


    const _ideas = await Promise.all(ideas);
    setIdeas(_ideas);
  }, [contract]);


  const addIdea = async (
    _name,
    _description,
 
  ) => {
  
    try {
      await contract.methods
        .addIdea(_name, _description)
        .send({ from: address });
      getIdeas();
    } catch (error) {
      alert(error);
    }
  };


  const rateGood = async (_index) => { 
    try {
      await contract.methods.good(_index).send({ from: address });
      getIdeas();
      alert("you have successfully rate this idea");
    } catch (error) {
      alert(error);
    }};

    const ratePerfect = async (_index) => { 
      try {
        await contract.methods.perfect(_index).send({ from: address });
        getIdeas();
        alert("you have successfully rate this idea");
      } catch (error) {
        alert(error);
      }};

   const rateBad = async (_index) => { 
    try {
      await contract.methods.bad(_index).send({ from: address });
      getIdeas();
      alert("you have successfully rate this idea");
    } catch (error) {
      alert(error);
    }};




  const removeIdea = async (
    _index
  ) => {
    try {
      await contract.methods
        .removeIdea(_index)
        .send({ from: address });
      getIdeas();
      alert("you have successfully deleted this idea");
    } catch (error) {
      alert(error);
    }
  };


  const support = async (_index, _ammount) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
        let ammount = new BigNumber(_ammount).shiftedBy(ERC20_DECIMALS).toString();
      await cUSDContract.methods
        .approve(contractAddress, ammount)
        .send({ from: address });
      await contract.methods.supportIdea(_index, ammount).send({ from: address });
      getIdeas();
      getBalance();
      alert("you have successfully supported this idea");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getIdeas();
    }
  }, [contract, getIdeas]);
  
  return (
    <div className="App">
      <Home cUSDBalance={cUSDBalance} addIdea={addIdea} />
      <Ideas 
      ideas={ideas} 
      supportIdea={support} 
      walletAddress={address} 
      ratePerfect={ratePerfect}
      rateGood={rateGood}
      rateBad={rateBad}
      removeIdea={removeIdea}
      />
      
    </div>
  );
}

export default App;