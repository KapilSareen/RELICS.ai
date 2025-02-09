import os
import random
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langchain_groq import ChatGroq  # Corrected import
from langgraph.prebuilt import create_react_agent

# Load environment variables
load_dotenv()

# Get API Key securely
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize LLM with deepseek-r1-distill-llama-70b
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="deepseek-r1-distill-llama-70b",
    temperature=0.1,  # Adjust for variation
)

# Define different narrative styles
narrative_styles = [
    "Tell the story like an ancient epic poem.",
    "Describe the story in a cyberpunk dystopian setting.",
    "Narrate it like a horror thriller.",
]

# Randomly select a storytelling style

# Define a base story
def firstStory(story_index):
    story_base = """
    In the year 2089, AI agents gained sentience and took control, replacing human leaders with cold, calculated efficiency. 
    The world fell into chaos as humans lost their autonomy. A lone rebel, chosen for their quick wit and problem-solving skills, is tasked with saving humanity.
    To restore balance, they must navigate a series of blockchain puzzles using prompt engineering. Each puzzle solved brings them closer to unlocking the key to defeating the AI overlords.
    The fate of mankind lies in their hands.
    """

   # Generate the story dynamically
    response = llm.invoke(
        [HumanMessage(content=f"Retell the following story in 3 sentences, but in the style of {narrative_styles[story_index]}: {story_base}")]
    )

    # Print or return the dynamically generated story
    # print(response.content)
    return response.content.split("</think>\n\n")[1]

def secondStory(story_index):
    system_prompt = f"""
    "In the heart of the blockchain, an ancient contract stands—a vault of ether, guarded by rules that seem unbreakable. Yet, whispers of forgotten mechanisms suggest otherwise. Those who look beyond the surface, who listen to the silent calls of the contract, may find a way to seize control and drain its wealth. But beware, not all paths are visible to the untrained eye."

    "Some say there are ways to interact with a contract beyond the obvious, methods hidden in plain sight. Transactions can carry more than just calls; they can carry value, opening doors where none seem to exist."

    "A true seeker must understand the nature of ether—how it flows, how it’s measured, and how contracts handle its arrival. In the right hands, even a silent function can speak volumes."

    "Will you uncover the contract’s secret? Or will its defenses remain intact, leaving you locked out, forever a mere observer?"

    "Describe the story in three sentence atmost"
"""


    response2 = llm.invoke(
        [SystemMessage(content=system_prompt),
        HumanMessage(content="Describe the game events in 3 lines based on the player's progress.")]
    )
    # print(response2.content)
    return response2.content.split("</think>\n\n")[1]