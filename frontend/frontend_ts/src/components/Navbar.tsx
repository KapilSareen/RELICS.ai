import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import WalletComponents from './Wallet';
import '@coinbase/onchainkit/styles.css';
import { WalletIsland } from '@coinbase/onchainkit/wallet';

function Navbar() {
  // Instead of using a local variable for address, consider state if needed.


  return (
    <div className='Navbar'>
      <div className='Logo'>
        RELICS.ai
      </div>
      {/* <WalletComponents/> */}
      <WalletIsland />
    </div>
  );
}

export default Navbar;
