import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

solprices_df = pd.read_csv("solprices_df.csv")
metadata_df = pd.read_csv("metadata_df.csv")

def calculate_mcap_weighted_index_by_tag(tag: str):

    good_tokens = set(metadata_df[metadata_df['tags'].str.contains(tag, na=False)].id)
    # Filter solprices_df to include only tokens with the specified tag
    filtered_df = solprices_df[solprices_df['id'].isin(good_tokens)]
    # Check if the filtered dataframe is empty  
    if filtered_df.empty:
        print(f"No tokens found with tag: {tag}")
        return pd.DataFrame()
    return calculate_mcap_weighted_index(filtered_df)


def calculate_mcap_weighted_index(df, base_value=100):
    # Copy & prepare
    df = df.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(['id', 'timestamp'])
    
    # 1) Compute each token's simple return; missing→0
    df['return'] = df.groupby('id')['price'].pct_change().fillna(0)
    
    # 2) Lag market caps by one period; for the first date assume no impact (return=0)
    df['mcap_lag'] = df.groupby('id')['market_cap'].shift(1)
    df['mcap_lag'] = df['mcap_lag'].fillna(0)
    
    # 3) For each timestamp, compute index return = sum(mcap_lag * return) / sum(mcap_lag)
    agg = df.groupby('timestamp').apply(
        lambda g: pd.Series({
            'index_return': (g['mcap_lag'] * g['return']).sum() / g['mcap_lag'].sum() if g['mcap_lag'].sum() else 0,
            'total_market_cap': g['market_cap'].sum()
        })
    )
    
    # 4) Reconstruct the index value by compounding returns
    agg = agg.sort_index()
    agg['index_value'] = (1 + agg['index_return']).cumprod() * base_value
    
    # 5) Normalise if you still want a 100-base at the start
    # (optional since base_value did that already)
    agg['normalized_index'] = agg['index_value']
    
    # 6) Add total market cap of all tokens by datetime
    agg['total_mcap'] = df.groupby('timestamp')['market_cap'].sum().values

    return agg.reset_index()

def calculate_token_metrics(market_index_df):
    """
    Calculate various metrics for each token based on its relationship with the market index.
    
    Args:
        market_index_df: DataFrame containing the market index values
        
    Returns:
        DataFrame with token metrics including USens, DSens, Beta, price changes, and overbought coefficient
    """
    # Ensure we have the market index data properly formatted
    market_index_df = market_index_df.copy()
    market_index_df['timestamp'] = pd.to_datetime(market_index_df['timestamp'])
    market_index_df = market_index_df.sort_values('timestamp')
    
    # Calculate market index returns
    market_index_df['market_return'] = market_index_df['index_value'].pct_change().fillna(0)
    
    # Get unique token IDs
    token_ids = solprices_df['id'].unique()
    
    # Initialize results list
    results = []
    
    for token_id in token_ids:
        # Get token data
        token_df = solprices_df[solprices_df['id'] == token_id].copy()
        token_df['timestamp'] = pd.to_datetime(token_df['timestamp'])
        token_df = token_df.sort_values('timestamp')
        
        # Calculate token returns
        token_df['token_return'] = token_df['price'].pct_change().fillna(0)
        
        # Merge with market index data
        merged_df = pd.merge(token_df, market_index_df[['timestamp', 'market_return']], on='timestamp', how='inner')
        
        if len(merged_df) < 10:  # Skip tokens with insufficient data
            continue
            
        # Calculate USens (upward sensitivity)
        up_markets = merged_df[merged_df['market_return'] > 0]
        usens = 0
        if len(up_markets) > 0:
            # Percentage of times token moves up when market moves up
            usens = len(up_markets[up_markets['token_return'] > 0]) / len(up_markets)
        
        # Calculate DSens (downward sensitivity)
        down_markets = merged_df[merged_df['market_return'] < 0]
        dsens = 0
        if len(down_markets) > 0:
            # Percentage of times token moves down when market moves down
            dsens = len(down_markets[down_markets['token_return'] < 0]) / len(down_markets)
        
        # Calculate Beta (linear coefficient)
        if len(merged_df) > 1:
            # Simple linear regression
            X = merged_df['market_return'].values.reshape(-1, 1)
            y = merged_df['token_return'].values
            try:
                model = LinearRegression().fit(X, y)
                beta = model.coef_[0]
            except:
                # Fallback if sklearn is not available
                beta = np.cov(merged_df['market_return'], merged_df['token_return'])[0, 1] / np.var(merged_df['market_return']) if np.var(merged_df['market_return']) != 0 else 0
        else:
            beta = 0
        
        # Calculate price changes
        # Get the most recent price data
        recent_data = token_df.sort_values('timestamp', ascending=False)
        
        # 24h price change (8 observations)
        price_24h_change = 0
        if len(recent_data) >= 8:
            current_price = recent_data.iloc[0]['price']
            price_24h_ago = recent_data.iloc[7]['price']
            price_24h_change = ((current_price / price_24h_ago) - 1) * 100 if price_24h_ago > 0 else 0
        
        # 7d price change (56 observations)
        price_7d_change = 0
        if len(recent_data) >= 56:
            current_price = recent_data.iloc[0]['price']
            price_7d_ago = recent_data.iloc[55]['price']
            price_7d_change = ((current_price / price_7d_ago) - 1) * 100 if price_7d_ago > 0 else 0
        
        # Calculate overbought coefficient
        overbought_coef = 0
        if len(recent_data) >= 90:  # Need 2 weeks of data
            # Volume of past week
            past_week_volume = recent_data.iloc[:45]['volume_24h'].sum()
            # Volume of week before past
            week_before_volume = recent_data.iloc[45:90]['volume_24h'].sum()
            
            # Calculate overbought coefficient
            if week_before_volume > 0:
                volume_ratio = past_week_volume / week_before_volume
                overbought_coef = price_7d_change + volume_ratio
            else:
                overbought_coef = price_7d_change
        
        # Store results
        results.append({
            'id': token_id,
            'usens': round(usens, 2),
            'dsens': round(dsens, 2),
            'beta': round(beta, 2),
            'change24h': round(price_24h_change, 2),
            'change7d': round(price_7d_change, 2),
            'overbought_coef': round(overbought_coef, 2)
        })
    
    # Convert results to DataFrame
    return pd.DataFrame(results)
