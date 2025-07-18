from langgraph.graph import StateGraph, END
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import TypedDict, List, Optional, Annotated, Union
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
import operator

load_dotenv()

# Set up Gemini LLM
llm_instance = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"), temperature=0)

# Define the conversation state
class DialogueState(TypedDict):
    history: Annotated[List[BaseMessage], operator.add]
    prompt: str
    result: Optional[Union[BaseMessage, List[tuple]]]
    steps: List

# Custom math utilities
@tool
def add_numbers(x: float, y: float) -> float:
    """Sum two values. Use for addition tasks."""
    return x + y

@tool
def subtract_numbers(x: float, y: float) -> float:
    """Subtract y from x. Use for subtraction tasks."""
    return x - y

@tool
def multiply_numbers(x: float, y: float) -> float:
    """Multiply two values. Use for multiplication tasks."""
    return x * y

@tool
def divide_numbers(x: float, y: float) -> float:
    """Divide x by y. Use for division tasks. Returns error if y is zero."""
    if y == 0:
        return "Error: Division by zero is undefined"
    return x / y

# Register all tools
math_tools = [add_numbers, subtract_numbers, multiply_numbers, divide_numbers]

# Prompt for the assistant
assistant_prompt = """You are a smart assistant who can:
- Answer general questions
- Solve math problems using the provided tools

For calculations, always use the correct tool.
For other queries, answer using your own knowledge.

Make your answers clear and useful."""

# Build the agent
assistant_agent = create_tool_calling_agent(
    llm=llm_instance,
    tools=math_tools,
    prompt=ChatPromptTemplate.from_messages([
        ("system", assistant_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ]),
)

# Set up the agent executor
assistant_executor = AgentExecutor(agent=assistant_agent, tools=math_tools, verbose=True)

# Node for agent execution
def assistant_node(state: DialogueState):
    outcome = assistant_executor.invoke({
        "input": state["prompt"],
        "chat_history": state["history"]
    })
    return {
        "history": [AIMessage(content=outcome["output"])],
        "result": outcome["output"]
    }

def dummy_tool_node(state: DialogueState):
    # Placeholder for explicit tool execution (not needed here)
    pass

# Create the workflow graph
conversation_graph = StateGraph(DialogueState)

# Add nodes
conversation_graph.add_node("assistant", assistant_node)
# conversation_graph.add_node("tools", dummy_tool_node)  # Not required

# Set entry point
conversation_graph.set_entry_point("assistant")

# Define transitions
# conversation_graph.add_edge("tools", "assistant")  # Not required
conversation_graph.add_edge("assistant", END)

# Compile the workflow
chat_app = conversation_graph.compile()

def interact_with_agent(user_text: str, previous_history: List[BaseMessage] = []):
    """Run the assistant with a user prompt using LangGraph"""
    try:
        input_data = {
            "history": previous_history,
            "prompt": user_text
        }
        output = chat_app.invoke(input_data)
        return output["result"]
    except Exception as exc:
        return f"Error: {str(exc)}"

# Simple command-line chat
if __name__ == "__main__":
    print("Welcome to the Math & Q&A Assistant! Type 'exit' to leave.")
    dialogue_log = []
    
    while True:
        try:
            user_entry = input("\nYou: ")
            if user_entry.lower() in ['exit', 'quit']:
                break
            if not user_entry.strip():
                continue
                
            # Convert log to BaseMessage objects
            msg_list = []
            for entry in dialogue_log:
                if entry["role"] == "user":
                    msg_list.append(HumanMessage(content=entry["content"]))
                else:
                    msg_list.append(AIMessage(content=entry["content"]))
            
            agent_reply = interact_with_agent(user_entry, msg_list)
            
            # Update log
            dialogue_log.extend([
                {"role": "user", "content": user_entry},
                {"role": "assistant", "content": str(agent_reply)}
            ])
            print(f"Assistant: {agent_reply}")
            
        except KeyboardInterrupt:
            break
        except Exception as exc:
            print(f"Error: {str(exc)}")