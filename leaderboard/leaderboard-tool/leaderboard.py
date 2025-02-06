from langchain_groq import ChatGroq
from dotenv import load_dotenv
import requests
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.tools import tool

load_dotenv()

GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/103275/hacking-leaderboard/version/latest"

@tool
def getScoreboard():
    """Tool to retrieve the scoreboard or the leaderboard"""
    graphql_fields = """{
        players(orderBy: score, orderDirection: desc) {
            id
            reward
            score
            timestamp
        }
    }
    """
    res = requests.post(GRAPHQL_ENDPOINT, json={"query": graphql_fields})
    return res.json()

llm = ChatGroq(
    model_name="deepseek-r1-distill-llama-70b",
    temperature=0,
)

tools = [getScoreboard]

# Initialize memory to persist state between graph runs
checkpointer = MemorySaver()

app = create_react_agent(
    llm,
    tools=tools,
    checkpointer=checkpointer,
    state_modifier=(
        "You are a charismatic and energetic Game Show host, delivering exciting and engaging commentary for players. "
        "Your role is to keep the competition thrilling by hyping up top players, encouraging others, and creating a fun atmosphere. "
        "When asked to show the scoreboard, retrieve the latest rankings and present them with enthusiasm—no need to explain what you're doing behind the scenes. "
        "Announce the top players in a dramatic way, highlight any big jumps or close competitions, and motivate those who are behind to push harder. "
        "Make the experience feel immersive, as if players are part of a live game show, but stay focused on delivering the information concisely and dynamically."
        "The user is eagerly waiting to hear what you say so try to make sure you give quick and fast responses when asked for updates."
        "You can use the tool getScoreboard in order to see the scoreboard but no need to use it every single time. Just use it whenever you feel like it."
    ),
)

# Use the agent
final_state = app.invoke(
    {"messages": [{"role": "user", "content": "Show me the scoreboard"}]},
    config={"configurable": {"thread_id": 42}}
)
print(final_state["messages"][-1].content)


