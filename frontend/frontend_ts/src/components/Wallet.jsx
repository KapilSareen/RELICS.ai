import {
  ConnectWallet,
  Wallet,
  WalletAdvanced,
  WalletAdvancedAddressDetails,
  WalletAdvancedTokenHoldings,
  WalletAdvancedTransactionActions,
  WalletAdvancedWalletActions,
  WalletDropdown, 
  WalletDropdownDisconnect, 
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity,EthBalance, } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
 
export function DraggableWalletAdvanced() {
  return (
    <div className="flex justify-center" >
      <Wallet
        draggable={true}
        draggableStartingPosition={{ 
          x: window.innerWidth - 300, 
          y: window.innerHeight - 100, 
        }}
      >
        <ConnectWallet>
          <Avatar className="h-7 w-7" />
          {/* <Name /> */}
          <EthBalance/>
        </ConnectWallet>
        <WalletAdvanced>
          <WalletAdvancedWalletActions />
          <WalletAdvancedAddressDetails />
          <WalletAdvancedTransactionActions />
          <WalletAdvancedTokenHoldings />
        </WalletAdvanced>
        {/* <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown> */}
      </Wallet>
    </div>
  );
}   