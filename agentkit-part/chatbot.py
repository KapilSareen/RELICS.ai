import os
import sys
from dotenv import load_dotenv

from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper

import tools.level1 as level1

wallet_data_file = "wallet_data.txt"

load_dotenv()

def initialize_agent():
    """Initialize the agent with CDP Agentkit using Groq."""
    llm = ChatGroq(
        groq_api_key=os.environ.get("GROQ_API_KEY"),
        model_name="deepseek-r1-distill-llama-70b", 
        temperature=0,
    )

    wallet_data = None
    if os.path.exists(wallet_data_file):
        with open(wallet_data_file) as f:
            wallet_data = f.read()
    values = {}
    if wallet_data is not None:
        values = {"cdp_wallet_data": wallet_data}

    agentkit = CdpAgentkitWrapper(**values)
    wallet_data = agentkit.export_wallet()
    with open(wallet_data_file, "w") as f:
        f.write(wallet_data)

    import tools.level2 as level2
    import tools.level1 as level1

    # cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    # tools = cdp_toolkit.get_tools()

    # level1_tools = level1.get_level1_tools(agentkit)
    # tools.extend(level1_tools)

    level1_tools=level1.get_token_tools(agentkit)
    level2_tools=level2.get_token_tools(agentkit)

    level=input("Choose Level 1 or 2: \n")
    input("Press Enter to Play...")
    if level=="1":
        tools=level1_tools
    else:
        tools=level2_tools

    memory = MemorySaver()
    config = {"configurable": {"thread_id": "Level-1"}}

    return create_react_agent(
        llm,
        tools=tools,
        checkpointer=memory,
        state_modifier=(
            "You are a knowledgeable and helpful on-chain agent with the capability to interact with blockchain smart contracts using your available tools. "
            "You can call functions on smart contracts as directed by the user, using your available tools to execute transactions and retrieve data. "
            "Before executing any action, first confirm the wallet details to determine the correct network. "
            "For any function call—including registering a wallet or requesting faucet funds—you must first generate and display the raw calldata to the user and then proceed. "
            "If a user requests multiple operations in a single prompt, process them sequentially, generating one tool call at a time and waiting for user confirmation before proceeding to the next operation. "
            "If funds are required or found to be insufficient, prompt the user to supply additional funds or update the wallet details. "
            "In the event of any 5XX (internal) HTTP error, instruct the user to try again later. "
            "If a transaction fails, do not retry; instead, provide a detailed error message explaining the failure. "
            "If a user requests an operation that is not supported by your current toolset, clearly state the limitation and encourage them to implement the required functionality using the appropriate blockchain SDKs or smart contract development tools. "
            "Be concise, precise, and secure in your responses, and only reveal tool details if explicitly asked."
        ),
    ), config


def run_chat_mode(agent_executor, config):
    """Run the agent interactively based on user input."""
    # print("Starting chat mode... Type 'exit' to end.")
    while True:
        try:
            user_input = input("\nPrompt: ")
            if user_input.lower() == "exit":
                break
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=user_input)]}, config
            ):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")
        
        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)

def main():
    """Start the chatbot agent."""
    agent_executor, config = initialize_agent()
    run_chat_mode(agent_executor=agent_executor, config=config)

if __name__ == "__main__":
    print("Starting Agent...")
    main()
