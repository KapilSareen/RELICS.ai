from cdp import Wallet
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
from web3 import Web3

# ---------------------------
# Setup: RPC, contract address & ABI
# ---------------------------
RPC_URL = "https://sepolia.infura.io/v3/562af077c32046d3bbbe28d699eea607"
CONTRACT_ADDRESS = "0x2d5ACFa7706F4d5124663Fd3C626E0B375D3DC5b"
CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "getContribution",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

w3 = Web3(Web3.HTTPProvider(RPC_URL))

# ---------------------------
# Tool 1: Get Contribution
# ---------------------------
GET_CONTRIBUTION_PROMPT = """
This tool fetches the contribution amount for the caller from the Fallback contract.
"""

class GetContributionInput(BaseModel):
    wallet_address: str = Field(
        None,
        description="The wallet address to check the contribution for. Uses the agent's default wallet if not provided."
    )

def get_contribution(wallet: Wallet, **kwargs) -> str:
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    wallet_address = wallet._addresses[0].address_id
    private_key = wallet._addresses[0].key
    contribution = contract.functions.getContribution().call({"from": wallet_address})
    return f"Contribution for {wallet_address}: {contribution}"

# ---------------------------
# Tool 2: Contribute
# ---------------------------
CONTRIBUTE_PROMPT = """
This tool allows the caller to contribute to the Fallback contract.
The contribution value (in Wei if unit not specified ) must be less than 0.001 ether.
"""

class ContributeInput(BaseModel):
    wallet_address: str = Field(
        None,
        description="The wallet address sending the contribution. Uses the agent's default wallet if not provided."
    )
    private_key: str = Field(
        None,
        description="The private key corresponding to the wallet. Uses the agent's default private key if not provided."
    )
    value_in_wei: int = Field(
        ...,
        description="The contribution amount in Wei (must be less than 0.001 ether)."
    )

def contribute(wallet: Wallet, value_in_wei: int = 0, **kwargs) -> str:
    wallet_address = wallet._addresses[0].address_id
    private_key = wallet._addresses[0].export()

    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    nonce = w3.eth.get_transaction_count(wallet_address)

    tx = contract.functions.contribute().build_transaction({
        'from': wallet_address,
        'value': value_in_wei,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.to_wei('50', 'gwei')  # Fix: Corrected method
    })

    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)  # Fix: Correct attribute name

    return f"Contribution transaction sent: {tx_hash.hex()}"


# ---------------------------
# Tool 3: Withdraw
# ---------------------------
WITHDRAW_PROMPT = """
This tool allows the contract owner to withdraw funds from the Fallback contract.
"""

class WithdrawInput(BaseModel):
    wallet_address: str = Field(
        None,
        description="The wallet address of the contract owner. Uses the agent's default wallet if not provided."
    )
    private_key: str = Field(
        None,
        description="The private key corresponding to the wallet. Uses the agent's default private key if not provided."
    )

def withdraw(wallet: Wallet, **kwargs) -> str:
    wallet_address = wallet._addresses[0].address_id
    private_key = wallet._addresses[0].export()


    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    nonce = w3.eth.get_transaction_count(wallet_address)
    
    tx = contract.functions.withdraw().build_transaction({
        'from': wallet_address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.to_wei('50', 'gwei')
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return f"Withdraw transaction sent: {tx_hash.hex()}"

# ---------------------------
# Factory Function to Create Level 1 Tools
# ---------------------------
def get_level1_tools(agentkit):
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
        func=contribute,
    )

    withdrawTool = CdpTool(
        name="withdraw",
        description=WITHDRAW_PROMPT,
        cdp_agentkit_wrapper=agentkit,
        input_schema=WithdrawInput,
        func=withdraw,
    )

    return [getContributionTool, contributeTool, withdrawTool]
