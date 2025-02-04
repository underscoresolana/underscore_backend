from langchain.agents import AgentExecutor, BaseSingleActionAgent
from langchain.schema import AgentAction, AgentFinish
from typing import List, Tuple, Any, Dict
from transformers import pipeline
import numpy as np

class SafetyChecker:
    """Custom content safety agent using Hugging Face detectors"""
    
    def __init__(self):
        self.classifier = pipeline(
            "text-classification",
            model="facebook/roberta-hate-speech-dynabench-r4-target",
            top_k=1
        )
    
    async def is_unsafe(self, text: str, threshold: float = 0.92) -> bool:
        results = await self.classifier(text)
        return any(p['score'] > threshold and p['label'] == 'hate' for p in results)

class TokenResearchAgent(BaseSingleActionAgent):
    """LangChain agent for autonomous token research"""
    
    @property
    def input_keys(self):
        return ["token_address", "research_goal"]
    
    async def plan(
        self, intermediate_steps: List[Tuple[AgentAction, str]], **kwargs
    ) -> AgentAction:
        from src.connectors.solana.spl_token_client import SPLTokenClient
        
        client = SPLTokenClient()
        metadata = await client.get_token_metadata(kwargs["token_address"])
        
        return AgentAction(
            tool="token_researcher",
            tool_input={
                "metadata": metadata,
                "goal": kwargs["research_goal"]
            },
            log="Researching token: {token_address}"
        )

    async def aexecute_plan(self, **kwargs) -> AgentFinish:
        # Implementation details omitted for brevity
        return AgentFinish(
            return_values={"result": "Research completed"},
            log="Token analysis finished"
        )
