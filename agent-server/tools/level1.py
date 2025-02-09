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
ABI_FILE = "levels/level1/abi.json"

try:
    with open(ABI_FILE, "r") as f:
        CONTRACT_ABI = json.load(f)
    if not isinstance(CONTRACT_ABI, list):
        raise ValueError("Invalid ABI format: Expected a list")
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Error loading ABI file: {e}")
    CONTRACT_ABI = []  


RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("LEVEL_1_CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC_URL))

############################
# Tool 1: Get Contribution (via getContribution function)
############################
GET_CONTRIBUTION_PROMPT = """
This tool fetches the caller's overall contribution from the Fallback contract.
"""

class GetContributionInput(BaseModel):
    wallet_address: str = Field(
        None,
        description="(Optional) The wallet address to check the contribution for. Defaults to the agent's wallet."
    )

def get_contribution(wallet: Wallet, **kwargs) -> str:
    # Use provided wallet_address or default to agent's first address
    wallet_address =  wallet._addresses[0].address_id
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    contribution = contract.functions.getContribution().call({"from": wallet_address})
    return f"Contribution for {wallet_address}: {contribution}"

############################
# Tool 2: Contribute
############################
CONTRIBUTE_PROMPT = """
This tool allows the caller to contribute to the Fallback contract.
The contribution value (in Wei, if unit not specified) must be less than 0.001 ether.
"""

class ContributeInput(BaseModel):
    value: str = Field(
        ...,
        description="(Optional) The contribution amount in wei (must be less than 0.001 ether). - take from user prompt , convert to wei if needed. Take 0.00001 as default value."
    )

def contribute(wallet: Wallet, **kwargs) -> str:
    print("Contribute tool called")
    wallet_address =  wallet._addresses[0].address_id
    private_key = wallet._addresses[0].export()
    value = 10**18 * kwargs.get("value", 0.000000001)
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    nonce = w3.eth.get_transaction_count(wallet_address)
    tx = contract.functions.contribute().build_transaction({
        'from': wallet_address,
        'value': int(value) ,
        'nonce': nonce,
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    print(f"Contribution transaction sent: {tx_hash.hex()}")
    return f"Contribution transaction sent: {tx_hash.hex()}"

############################
# Tool 3: Withdraw
############################
WITHDRAW_PROMPT = """
This tool allows the contract owner to withdraw funds from the Fallback contract.
"""

class WithdrawInput(BaseModel):
    wallet_address: str = Field(
        None,
        description="(Optional) The wallet address of the owner. Defaults to the agent's wallet."
    )
    private_key: str = Field(
        None,
        description="(Optional) The private key for signing. Defaults to the agent's private key."
    )

def withdraw(wallet: Wallet, **kwargs) -> str:
    print("Withdraw tool called")
    wallet_address =  wallet._addresses[0].address_id
    private_key =  wallet._addresses[0].export()
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    nonce = w3.eth.get_transaction_count(wallet_address)
    tx = contract.functions.withdraw().build_transaction({
        'from': wallet_address,
        'nonce': nonce,
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return f"Withdraw transaction sent: {tx_hash.hex()}"

############################
# Tool 4: Check Contributions Mapping
############################
CHECK_CONTRIBUTIONS_PROMPT = """
This tool returns the stored contribution for a given address from the contributions mapping.
"""

class CheckContributionsInput(BaseModel):
    target_address: str = Field(
        ...,
        description="The address for which to check the contribution."
    )

def check_contributions(wallet: Wallet, **kwargs) -> str:
    print("Check Contributions tool called")
    target_address = wallet._addresses[0].address_id
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    contribution = contract.functions.contributions(target_address).call()
    return f"Contribution for {target_address}: {contribution}"

############################
# Tool 5: Check if Game is Won (isWon)
############################
IS_WON_PROMPT = """
This tool returns the game status (isWon) from the contract.
"""

class IsWonInput(BaseModel):
    # No input needed.
    pass

def is_won(wallet: Wallet, **kwargs) -> str:
    print("Is Won tool called")
    address=wallet._addresses[0].address_id
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    won = contract.functions.isWon().call({'from': address})
    return f"Game won status: {won}"

############################
# Tool 6: Get Owner
############################
OWNER_PROMPT = """
This tool returns the owner's address of the contract.
"""

class OwnerInput(BaseModel):
    # No input needed.
    pass

def get_owner(wallet: Wallet, **kwargs) -> str:
    print("Get Owner tool called")
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    owner_address = contract.functions.owner().call()
    return f"Contract owner address: {owner_address}"

# ---------------------------
# Tool 7: My Address
# ---------------------------

ADDRESS_PROMPT = """
This tool gives the wallet address of this agent.
"""

class MyAddressInput(BaseModel):
    pass

def my_address(wallet: Wallet, **kwargs) -> str:
    print("My Address tool called")
    address = wallet._addresses[0].address_id
    return f"Your wallet address: {address}"

# ---------------------------
# Tool 8: My Balance
# ---------------------------
class MyBalanceInput(BaseModel):
    pass

def my_balance(wallet: Wallet, **kwargs) -> str:
    print("My Balance tool called")
    wallet_address = wallet._addresses[0].address_id
    balance = w3.eth.get_balance(wallet_address)
    return f"Balance of {wallet_address}: {w3.from_wei(balance, 'ether')} ETH"

############################
# Tool 9: Send money to fallback contract 's fallback function
############################`

class SendFundsInput(BaseModel):
    pass

SEND_FUNDS_PROMPT = """
This tool transfer's ETH to the Fallback contract.
"""
    

def send_funds(wallet: Wallet, **kwargs) -> str:
    address = wallet._addresses[0].address_id
    private_key = wallet._addresses[0].export()
    contract_address = CONTRACT_ADDRESS

    chain_id = w3.eth.chain_id  

    tx = {
        'from': address,
        'to': contract_address,
        'value': w3.to_wei(0.000001, 'ether'),
        'gas': 50000,
        'gasPrice': w3.to_wei('20', 'gwei'),
        'nonce': w3.eth.get_transaction_count(address),
        'chainId': chain_id  # Adding chain ID for EIP-155
    }

    signed_tx = w3.eth.account.sign_transaction(tx, private_key)

    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    print(f"Transaction successful: {tx_hash.hex()}")
    return f"Transaction successful: {tx_hash.hex()}"

############################
# Factory Function to Create Level 1 Tools
############################
def get_token_tools(agentkit):
    """
    Given an agentkit instance, returns a list of level 1 tools.
    """
    getContributionTool = CdpTool(
        name="getContribution",
        description=GET_CONTRIBUTION_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=GetContributionInput,
        func=get_contribution
    )

    contributeTool = CdpTool(
        name="contribute",
        description=CONTRIBUTE_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=ContributeInput,
        func=contribute
    )

    withdrawTool = CdpTool(
        name="withdraw",
        description=WITHDRAW_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=WithdrawInput,
        func=withdraw
    )

    checkContributionsTool = CdpTool(
        name="checkContributions",
        description=CHECK_CONTRIBUTIONS_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=CheckContributionsInput,
        func=check_contributions
    )

    isWonTool = CdpTool(
        name="isWon",
        description=IS_WON_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=IsWonInput,
        func=is_won
    )

    ownerTool = CdpTool(
        name="getOwner",
        description=OWNER_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=OwnerInput,
        func=get_owner
    )

    myAddressTool= CdpTool(
    name="myAddress",
    description=ADDRESS_PROMPT,
    cdp_agentkit_wrapper=agentkit,
    input_schema=MyAddressInput,
    func=my_address
    )

    transferTool = CdpTool(
        name="sendFunds",
        description=SEND_FUNDS_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=SendFundsInput,
        func=send_funds
    )

    myBalanceTool=CdpTool(
        name="myBalance",
        description="Fetches the caller's wallet balance in ETH.",
        cdp_agentkit_wrapper=agentkit,
        input_schema=MyBalanceInput,
        func=my_balance
    )

    return [
        getContributionTool,
        contributeTool,
        withdrawTool,
        checkContributionsTool,
        isWonTool,
        ownerTool,
        myAddressTool,
        myBalanceTool,
        transferTool
    ]

