import json
from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
from web3 import Web3
import os
import dotenv

dotenv.load_dotenv()

# ---------------------------
# Setup: Load ABI from file, RPC, and contract address
# ---------------------------
ABI_FILE = "levels/level2/abi.json"

try:
    with open(ABI_FILE, "r") as f:
        CONTRACT_ABI = json.load(f)
    if not isinstance(CONTRACT_ABI, list):
        raise ValueError("Invalid ABI format: Expected a list")
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Error loading ABI file: {e}")
    CONTRACT_ABI = []  


RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("LEVEL_2_CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC_URL))

############################
# Tool 1: Transfer Tokens
############################
TRANSFER_PROMPT = """
This tool allows the caller to transfer tokens to another address.
"""

class TransferInput(BaseModel):
    to_address: str = Field(..., description="The recipient's wallet address.")
    amount: int = Field(..., description="The amount of tokens to transfer.")


def transfer(wallet: Wallet, **kwargs) -> str:
    wallet_address = wallet._addresses[0].address_id
    private_key = wallet._addresses[0].export()
    to_address = kwargs["to_address"]
    amount = kwargs["amount"]
    
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    nonce = w3.eth.get_transaction_count(wallet_address)
    tx = contract.functions.transfer(to_address, amount).build_transaction({
        'from': wallet_address,
        'nonce': nonce,
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return f"Transfer transaction sent: {tx_hash.hex()}"

############################
# Tool 2: Check Balance
############################
BALANCE_PROMPT = """
This tool fetches the balance of a given address.
"""

class BalanceInput(BaseModel):
    wallet_address: str = Field(None, description="(Optional) The wallet address to check the balance for. Defaults to the agent's wallet.")


def balance_of(wallet: Wallet, **kwargs) -> str:
    target_address =  wallet._addresses[0].address_id
    print(target_address)
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    balance = contract.functions.balanceOf(target_address).call()
    return f"Balance for {target_address}: {balance} tokens"

############################
# Tool 3: Check if Game is Won
############################
IS_WON_PROMPT = """
This tool checks if the caller has won the game.
"""

class IsWonInput(BaseModel):
    pass

def is_won(wallet: Wallet, **kwargs) -> str:
    wallet_address = wallet._addresses[0].address_id
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    won = contract.functions.isWon().call({"from": wallet_address})
    return f"Game won status: {won}"

# ---------------------------
# Tool 4: My Address
# ---------------------------

ADDRESS_PROMPT = """
This tool retrieves the caller's wallet address.
"""

class MyAddressInput(BaseModel):
    wallet_address: str = Field(None, description="(Optional) The wallet address. Defaults to the agent's wallet.")

def my_address(wallet: Wallet, **kwargs) -> str:
    return f"Your wallet address: {wallet._addresses[0].address_id}"


############################
# Fetch Public Variable: totalSupply
############################
TOTAL_SUPPLY_PROMPT = """
This tool fetches the total supply of the token.
"""

class TotalSupplyInput(BaseModel):
    pass

def get_total_supply(wallet: Wallet, **kwargs) -> str:
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    total_supply = contract.functions.totalSupply().call()
    return f"Total Supply: {total_supply} tokens"


############################
# Factory Function to Create Token Tools
############################
def get_token_tools(agentkit):
    transferTool = CdpTool(
        name="transfer",
        description=TRANSFER_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=TransferInput,
        func=transfer
    )
    
    balanceTool = CdpTool(
        name="balanceOf",
        description=BALANCE_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=BalanceInput,
        func=balance_of
    )
    
    isWonTool = CdpTool(
        name="isWon",
        description=IS_WON_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=IsWonInput,
        func=is_won
    )

    totalSupplyTool = CdpTool(
        name="totalSupply",
        description=TOTAL_SUPPLY_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=TotalSupplyInput,
        func=get_total_supply
    )

    addressTool = CdpTool(
        name="myAddress",
        description=ADDRESS_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=MyAddressInput,
        func=my_address
    )


    return [transferTool, balanceTool, isWonTool, totalSupplyTool, addressTool]