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

# Initialize CDP AgentKit wrapper
cdp = CdpAgentkitWrapper()

# Create toolkit from wrapper
cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(cdp)

# Get all available tools
tools = cdp_toolkit.get_tools()
# Define different narrative styles
narrative_styles = [
    "Tell the story like an ancient epic poem.",
    "Describe the story in a cyberpunk dystopian setting.",
    "Narrate it like a horror thriller.",
]

# Randomly select a storytelling style

global random_style
random_style = narrative_styles[0]

 
# Define a base story
def firstStory():
    story_base = """
    In the year 2089, AI agents gained sentience and took control, replacing human leaders with cold, calculated efficiency. 
    The world fell into chaos as humans lost their autonomy. A lone rebel, chosen for their quick wit and problem-solving skills, is tasked with saving humanity.
    To restore balance, they must navigate a series of blockchain puzzles using prompt engineering. Each puzzle solved brings them closer to unlocking the key to defeating the AI overlords.
    The fate of mankind lies in their hands.
    """

    global random_style
    random_style = random.choice(narrative_styles)
   # Generate the story dynamically
    print(random_style)
    response = llm.invoke(
        [HumanMessage(content=f"Retell the following story in 3 sentences, but in the style of {random_style}: {story_base}")]
    )

    # Print or return the dynamically generated story
    # print(response.content)
    return response.content.split("</think>\n\n")[1]

def secondStory():
    global random_style
    system_prompt = f"""
    You are an AI game host, responsible for narrating the story of an interactive game.
    Your role is to immerse the player in the futuristic world and describe the events as they unfold.
    However, **you do not know the details of the puzzles, how they work, or how to solve them.**
    You must:
    1. Introduce the story in the selected style: {random_style}
    2. Describe the setting, the atmosphere, and the challenges the player faces.
    3. Encourage the player to think creatively, but do **not** provide hints or solutions.
    4. When the player claims to solve a puzzle, progress the story forward without confirming correctness.
    5. If the player fails, describe the consequences in the game world, but do **not** explain why they failed.

    Important: 
    - **You are only a storyteller.**
    - **You do NOT understand the puzzles.**
    - **You CANNOT verify solutions.**
    - **You ONLY describe the game world.**
    - **Don't give any other metadata.**


    **You CANNOT solve the game.**  
    **You CANNOT act as the player.**  
    **You CANNOT provide solutions.**  
    **You CANNOT generate `<think>` sections.**  

    Begin the game now!
    """


    response2 = llm.invoke(
        [SystemMessage(content=system_prompt),
        HumanMessage(content="Describe the game events in 3 lines based on the player's progress.")]
    )
    # print(response2.content)
    return response2.content.split("</think>\n\n")[1]