import React, {useState, useEffect} from 'react'
import './Navbar.css'
import WalletComponents from './Wallet'
import '@coinbase/onchainkit/styles.css'; 
import { WalletIsland } from '@coinbase/onchainkit/wallet';

const apiKeyName = "Copy your secret API key name here."
const apiKeyPrivateKey = "Copy your secret API key's private key here."
import { getAddress } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
 


function Navbar() {
   // Access wallet state
  // const [address, setAddress] = useState('');
  let address =""
  const register = async()=>{
     address = await getAddress({ name: 'zizzamia.base.eth', chain: base });
     console.log(`${import.meta.env.VITE_PUBLIC_AGENT_URL}/register`)
    let a=await fetch (`${import.meta.env.VITE_PUBLIC_AGENT_URL}/register`, {method: "POST", headers:{"content-type":"application/json","Accept": "application/json"},
      body:JSON.stringify({"public_address": "0x123"})})
      console.log(a)
      await fetch (`${import.meta.env.VITE_PUBLIC_AGENT_URL}/login`, {method: "POST", headers:{"content-type":"application/json"},
        body:JSON.stringify({"public_address": "0x123"})})
        console.log(address)
  }

  useEffect(() => {
    register()
    if(address){
      register()
      console.log("address",address)
    }
  }, [address]);
  return (
    <div className='Navbar'>
        <div className='Logo'>
            RELICS.ai | AI + Web3 challenge
        </div>  
        {/* <WalletComponents/> */}
        <WalletIsland 
        />
    </div>
  )
}

export default Navbar