import React from 'react'
import './Navbar.css'
import WalletComponents from './Wallet'
import '@coinbase/onchainkit/styles.css'; 
import { WalletIsland } from '@coinbase/onchainkit/wallet';

const apiKeyName = "Copy your secret API key name here."
const apiKeyPrivateKey = "Copy your secret API key's private key here."


function Navbar() {
  return (
    <div className='Navbar'>
        <div className='Logo'>
            RELICS.ai | AI + Web3 challenge
        </div>  
        <WalletComponents/>
       
    </div>
  )
}

export default Navbar