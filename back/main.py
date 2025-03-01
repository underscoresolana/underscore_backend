from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional, Union
import json
import random
import math
import pandas as pd
from precalc import calculate_mcap_weighted_index, calculate_mcap_weighted_index_by_tag, solprices_df, metadata_df, calculate_token_metrics

app = FastAPI(title="Web3 Material Backend API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Calculate indices on startup
# Overall weighted index
overall_index = calculate_mcap_weighted_index(solprices_df)

# Get all unique tags from metadata_df
all_tags = []
for tags_str in metadata_df['tags'].dropna():
    tags = [tag.strip() for tag in tags_str.split(',')]
    all_tags.extend(tags)
all_tags = list(set(all_tags))

good_tags = {
 'memes': 1075,
 'ai-big-data': 166,
 'animal-memes': 156,
 'pump-fun': 104,
 'gaming': 86,
 'defi': 85,
 'collectibles-nfts': 81,
 'cat-themed': 78,
 'ai-memes': 71,
 'doggone-doggerel': 59,
 'ai-agents': 58,
 'political-memes': 49,
 'play-to-earn': 35,
 'web3': 31,
 'metaverse': 30,
 'depin': 28,
 'rehypothecated-crypto': 21,
 'defai': 20,
 'distributed-computing': 18,
 'celebrity-memes': 13,
 'payments': 13,
 'ip-memes': 12,
 'entertainment': 12,
 'real-world-assets': 11,
 'derivatives': 11,
 'amm': 11,
 'desci': 11,
 'zodiac-themed': 11,
 'generative-ai': 10,
 'ai-agent-launchpad': 10,
 'dex': 10,
 'oracles': 9,
 'yield-farming': 9,
 'lending-borowing': 9,
 'interoperability': 9,
 'wallet': 9,
 'launchpad': 8,
 'move-to-earn': 8,
 'art': 7,
 'content-creation': 7,
 'telegram-bot': 7,
 'media': 6,
 'asset-management': 6,
 'communications-social-media': 6,
 'gambling': 6,
 'vr-ar': 5,
 'enterprise-solutions': 5,
 'storage': 5,
 'analytics': 4,
 'filesharing': 4,
 'store-of-value': 4,
 'pow': 4,
 'presale-memes': 4,
 'sports': 4,
 'adult': 4,
 }


# Calculate weighted indices for all tags
tag_indices = {}
for tag in all_tags:
    if tag not in good_tags:
        continue
    tag_index = calculate_mcap_weighted_index_by_tag(tag)
    if not tag_index.empty:
        tag_indices[tag] = tag_index

# Calculate token metrics for all tokens
token_metrics_df = calculate_token_metrics(overall_index)

# Merge token metrics with metadata
token_df = pd.merge(
    metadata_df,
    token_metrics_df,
    on='id',
    how='left'
)

# Fill NaN values with defaults
token_df['usens'] = token_df['usens'].fillna(0)
token_df['dsens'] = token_df['dsens'].fillna(0)
token_df['beta'] = token_df['beta'].fillna(0)
token_df['change24h'] = token_df['change24h'].fillna(0)
token_df['change7d'] = token_df['change7d'].fillna(0)
token_df['overbought_coef'] = token_df['overbought_coef'].fillna(0)

# Print summary of token metrics calculation
print(f"Calculated metrics for {len(token_metrics_df)} tokens")
print(token_df.columns)
print(token_df.head())



# Mock data
# tokens = [
#     {
#         "id": "moodeng",
#         "name": "Moodeng",
#         "symbol": "MOO",
#         "fdv": 700000000,
#         "change24h": 24,
#         "change7d": 204,
#         "underScore": 71,
#         "scoreRating": "Great",
#         "tags": ["meme", "animal"],
#         "usens": 0.8,
#         "dsens": 0.5,
#         "beta": 2.5,
#         "betaDesc": "HR",
#         "groupRank": 1,
#         "groupTotal": 30,
#         "volatilityBeta": 1.7,
#         "overboughtOversold": 13
#     },
#     {
#         "id": "aiagnes",
#         "name": "AiAgnes",
#         "symbol": "AIAI",
#         "fdv": 250000000,
#         "change24h": -5,
#         "change7d": 35,
#         "underScore": 35,
#         "scoreRating": "Fair",
#         "tags": ["ai"],
#         "usens": 0.8,
#         "dsens": 0.5,
#         "beta": 2.5,
#         "betaDesc": "HR"
#     },
#     {
#         "id": "depin",
#         "name": "DePIN Memes",
#         "symbol": "DEPIN",
#         "fdv": 420000000,
#         "change24h": 12,
#         "change7d": 34,
#         "underScore": 65,
#         "scoreRating": "Good",
#         "tags": ["defi", "infrastructure"],
#         "usens": 0.7,
#         "dsens": 0.6,
#         "beta": 1.8,
#         "betaDesc": "MR"
#     },
#     {
#         "id": "gamefi",
#         "name": "GameFi",
#         "symbol": "GAME",
#         "fdv": 320000000,
#         "change24h": -2,
#         "change7d": 18,
#         "underScore": 58,
#         "scoreRating": "Good",
#         "tags": ["gaming", "metaverse"],
#         "usens": 0.6,
#         "dsens": 0.6,
#         "beta": 1.9,
#         "betaDesc": "MR"
#     }
# ]

overbought = [
    {"symbol": "$GNOME", "change": 3.2},
    {"symbol": "$GNOME", "change": 5.7},
    {"symbol": "$GNOME", "change": 12.4},
    {"symbol": "$GNOME", "change": 7.1}
]

oversold = [
    {"symbol": "$GNOME", "change": -4.8},
    {"symbol": "$GNOME", "change": -7.3},
    {"symbol": "$GNOME", "change": -9.6},
    {"symbol": "$GNOME", "change": -3.2}
]

underradar_picks = [
    {"name": "ATO", "hasReport": True},
    {"name": "GHI", "hasReport": True},
    {"name": "Bebracoin", "hasReport": True}
]

ai_report = {
    "statements": [
        {"text": "Ai sigmo report", "confidence": 80},
        {"text": "Very good token", "confidence": 6},
        {"text": "Nice boobs"},
        {"text": "Market sdkjfnskd"},
        {"text": "adfgsdfgsd"},
        {"text": "dsfgsdfgsdfg"},
        {"text": "sdfgsdfgsdfg"},
        {"text": "sfgjtyu ghjfu dthjkghjdfgs -- good!"}
    ],
    "finalScore": 65,
    "scoreRating": "Good"
}

trending_markets = [
    {"id": "memes", "name": "Memes", "size": "lg"},
    {"id": "depin", "name": "DePIN", "size": "md"},
    {"id": "market3", "name": "Market 3", "size": "md"},
    {"id": "market4", "name": "Market 4", "size": "md"},
    {"id": "ai-agents", "name": "AI Agents", "size": "md"},
    {"id": "market5", "name": "Market 5", "size": "md"}
]

underradar_markets = [
    {"id": "depin", "name": "DePIN", "size": "sm"},
    {"id": "gamefi", "name": "GameFi", "size": "sm"}
]

# Market heatmap data - calculated from real market data
heatmap_markets = []
all_market_ids = list(good_tags.keys())
for market_id in all_market_ids:
    # Use the trending_markets and underradar_markets to build the heatmap
    # Get market data from precalculations based on tags
    market_data = tag_indices.get(market_id, pd.DataFrame())
    if not market_data.empty:
        # Get the latest market cap and 24h change
        latest_data = market_data.iloc[-1]
        prev_data = market_data.iloc[-2] if len(market_data) > 1 else market_data.iloc[-1]
        
        # Calculate 24h change percentage
        change_24h = ((latest_data['index_value'] - prev_data['index_value']) / prev_data['index_value']) * 100
        last_total_mcap = latest_data['total_mcap']
        
        heatmap_markets.append({
            "id": market_id,
            "name": market_id,
            "size": (last_total_mcap / 1e9) / 3 + 2,
            "marketCap": latest_data['total_market_cap'],
            "change24h": change_24h
        })

# API endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to the Web3 Material Backend API"}

@app.get("/api/tokens")
async def get_tokens(skip: int = 0, limit: int = 30):
    # Convert token_df to a list of dictionaries with the required format
    formatted_tokens = []
    for _, row in token_df.iterrows():
        formatted_token = {
            "id": row['id'],
            "name": row['name'],
            "symbol": row['symbol'],
            "fdv": row['fdv'] if 'fdv' in row else 0,
            "change24h": row['change24h'],
            "change7d": row['change7d'],
            "underScore": int(row['usens'] * 100),
            "scoreRating": "Great" if row['usens'] > 0.7 else "Good" if row['usens'] > 0.5 else "Fair",
            "tags": [tag.strip() for tag in row['tags'].split(',') if isinstance(row['tags'], str) and tag.strip() in good_tags] if isinstance(row['tags'], str) else [],
            "usens": row['usens'],
            "dsens": row['dsens'],
            "beta": row['beta'],
            "betaDesc": "HR" if row['beta'] > 2.0 else "MR" if row['beta'] > 1.0 else "LR",
            "overboughtOversold": row['overbought_coef']
        }
        formatted_tokens.append(formatted_token)
    
    # Sort tokens by underScore in descending order
    sorted_tokens = sorted(formatted_tokens, key=lambda x: x["underScore"], reverse=True)
    
    # Get total count for pagination
    total_count = len(sorted_tokens)
    
    # Return the requested segment
    return {
        "tokens": sorted_tokens[skip:skip+limit],
        "total": total_count
    }

@app.get("/api/tokens/{token_id}")
async def get_token(token_id: str):
    # Try to find token in our calculated token metrics dataframe
    token_data = token_df[token_df['id'] == int(token_id)]
    if not token_data.empty:
        token_data = token_data.iloc[0].to_dict()
    else:
        token_data = {}
    
    if token_data:
        # Convert to dictionary format matching the mock data structure
        return {
            "id": token_data['id'],
            "name": token_data['name'],
            "symbol": token_data['symbol'],
            "fdv": token_data['fdv'] if 'fdv' in token_data else 0,
            "change24h": token_data['change24h'],
            "change7d": token_data['change7d'],
            "underScore": int(token_data['usens'] * 100) if 'usens' in token_data else 0,
            "scoreRating": "Great" if token_data['usens'] > 0.7 else "Good" if token_data['usens'] > 0.5 else "Fair",
            "tags": token_data['tags'].split(',') if isinstance(token_data['tags'], str) else [],
            "usens": token_data['usens'],
            "dsens": token_data['dsens'],
            "beta": token_data['beta'],
            "betaDesc": "HR" if token_data['beta'] > 2.0 else "MR" if token_data['beta'] > 1.0 else "LR",
            "overboughtOversold": token_data['overbought_coef']
        }
    
    # Fallback to mock data if not found in calculated metrics
    for token in tokens:
        if token["id"] == token_id:
            return token
            
    return {"error": "Token not found"}

@app.get("/api/market-state")
async def get_market_state():
    return {
    "name": "Comeback",
    "status": "Comeback",
    "changePercent": overall_index["index_return"].iloc[-8:].sum() * 100,
    "indexName": "Solana Leaders Index"
}

@app.get("/api/overbought")
async def get_overbought():
    return overbought

@app.get("/api/oversold")
async def get_oversold():
    return oversold

@app.get("/api/underradar-picks")
async def get_underradar_picks():
    return underradar_picks

@app.get("/api/ai-report")
async def get_ai_report():
    return ai_report

@app.get("/api/trending-markets")
async def get_trending_markets():
    return trending_markets

@app.get("/api/underradar-markets")
async def get_underradar_markets():
    return underradar_markets

# Generate mock chart data
@app.get("/api/market-chart-data")
async def get_chart_data(points: int = 20):
    # Get the last N points from the overall market index
    last_n_points = overall_index.iloc[-points:].reset_index()
    
    # Calculate the min and max values for normalization
    min_value = last_n_points["index_value"].min()
    max_value = last_n_points["index_value"].max()
    
    chart_data = []
    
    for i in range(len(last_n_points)):
        # Normalize the index value between 0 and 100
        normalized_value = 0
        if max_value > min_value:  # Avoid division by zero
            normalized_value = ((last_n_points["index_value"].iloc[i] - min_value) / 
                               (max_value - min_value)) * 100
        
        chart_data.append({
            "x": i,
            "y": normalized_value
        })
    
    return chart_data

# Best performer token
@app.get("/api/best-performer")
async def get_best_performer():
    # Find the best performing tag based on the most recent index return
    best_tag = None
    best_change24h = -float('inf')
    best_change7d = -float('inf')
    
    for tag, index_df in tag_indices.items():
        if len(index_df) >= 2:  # Need at least 2 data points for 24h change
            # Calculate 24h change (most recent return)
            change24h = index_df["index_return"].iloc[-8:].sum() * 100
            
            # Calculate 7d change (compound last 7 returns if available)
            last_n = min(7, len(index_df))
            change7d = ((1 + index_df["index_return"].iloc[-last_n:]).prod() - 1) * 100
            
            # Update best performer if this tag has better 24h performance
            if change24h > best_change24h:
                best_tag = tag
                best_change24h = change24h
                best_change7d = change7d
    
    if best_tag:
        return {
            "id": best_tag.lower().replace(" ", "-"),
            "name": best_tag.title(),
            "change24h": round(best_change24h, 2),
            "change7d": round(best_change7d, 2)
        }
    else:
        # Fallback if no tags with sufficient data
        return {
            "id": "defi",
            "name": "DeFi",
            "change24h": 15.8,
            "change7d": 42.3
        }

# Price dynamics data
@app.get("/api/price-dynamics/{token_id}")
async def get_price_dynamics(token_id: str, days: int = 30):
    # Find the token
    token = next((t for t in tokens if t["id"] == token_id), None)
    if not token:
        return {"error": "Token not found"}
    
    # Generate price dynamics data similar to frontend mock
    data = []
    for i in range(days):
        data.append({
            "day": i + 1,
            "price": 0.9 + math.sin(i / 5) * 0.1 + random.random() * 0.1,
            "market": 0.85 + math.sin(i / 7) * 0.05 + random.random() * 0.1,
            "group": 0.88 + math.sin(i / 6) * 0.06 + random.random() * 0.1,
        })
    
    return {
        "data": data,
        "score": ai_report["finalScore"],
        "scoreRating": ai_report["scoreRating"]
    }

# Fundamentals data
@app.get("/api/fundamentals/{token_id}")
async def get_fundamentals(token_id: str):
    # Find the token
    token = next((t for t in tokens if t["id"] == token_id), None)
    if not token:
        return {"error": "Token not found"}
    
    # Use the first 4 statements from AI report for fundamentals
    statements = ai_report["statements"][:4] if len(ai_report["statements"]) >= 4 else ai_report["statements"]
    
    return {
        "statements": statements,
        "finalScore": ai_report["finalScore"],
        "scoreRating": ai_report["scoreRating"]
    }

# Market heatmap data
@app.get("/api/market-heatmap")
async def get_market_heatmap():
    return heatmap_markets

# Top tokens for a specific market
@app.get("/api/top-market-tokens/{market_id}")
async def get_top_market_tokens(market_id: str, limit: int = 3):
    # In a real app, you'd filter tokens by market/category
    # For this mock, just return top tokens by underScore
    sorted_tokens = sorted(tokens, key=lambda x: x["underScore"], reverse=True)
    return sorted_tokens[:limit] if sorted_tokens else []

# Get overall market cap weighted index
@app.get("/api/index/overall")
async def get_overall_index():
    return overall_index.to_dict(orient="records")

# Get list of all available tag indices
@app.get("/api/index/tags")
async def get_available_tag_indices():
    return list(tag_indices.keys())

# Get market cap weighted index for a specific tag
@app.get("/api/index/tag/{tag}")
async def get_tag_index(tag: str):
    if tag in tag_indices:
        return tag_indices[tag].to_dict(orient="records")
    return {"error": f"No index data available for tag: {tag}"} 