import yfinance as yf
import pandas as pd
import numpy as np
from scipy import stats

# def fetch_data(tickers, start_date, end_date):
#     data = yf.download(tickers, start=start_date, end=end_date)
#     return data['Adj Close']

# def calculate_daily_returns(data):
#     returns = data.pct_change().dropna()
#     return returns

# def calculate_daily_returns(data):
#     returns = data.pct_change().dropna()
#     return returns

# def calculate_sharpe_ratio(returns, risk_free_rate=0.01):
#     mean_returns = returns.mean() * 252  # Annualize the returns
#     volatility = returns.std() * np.sqrt(252)  # Annualize the volatility
#     sharpe_ratio = (mean_returns - risk_free_rate) / volatility
#     return sharpe_ratio

# def calculate_capm(ticker, market_return, risk_free_rate=0.01):
#     stock = yf.Ticker(ticker)
#     beta = stock.info['beta']  # Fetch beta from yfinance
#     capm = risk_free_rate + beta * (market_return - risk_free_rate)
#     return capm

# def recommend_stocks(tickers, market_return, risk_free_rate=0.01):
#     recommendations = {}
#     for ticker in tickers:
#         stock_data = fetch_data(ticker, '2020-01-01', '2023-01-01')
#         daily_returns = calculate_daily_returns(stock_data)
        
#         sharpe = calculate_sharpe_ratio(daily_returns, risk_free_rate)
#         capm = calculate_capm(ticker, market_return, risk_free_rate)
        
#         recommendations[ticker] = {
#             'Sharpe Ratio': sharpe,
#             'CAPM': capm
#         }
    
#     # Sort recommendations based on a custom logic (e.g., Sharpe Ratio first, then CAPM)
#     sorted_recommendations = sorted(recommendations.items(), key=lambda x: (x[1]['Sharpe Ratio'], x[1]['CAPM']), reverse=True)
#     return sorted_recommendations

# Fetch historical data for a specific stock
ticker = 'AAPL'
data = yf.download(ticker, start='2020-01-01', end='2023-01-01')

# Calculate daily returns
returns = data['Adj Close'].pct_change().dropna()

# Calculate Sharpe Ratio
risk_free_rate = 0.01  # Example risk-free rate
sharpe_ratio = (returns.mean() * 252 - risk_free_rate) / (returns.std() * np.sqrt(252))

print(f'Sharpe Ratio for {ticker}: {sharpe_ratio}')