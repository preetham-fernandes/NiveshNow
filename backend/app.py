from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/api/trending-news', methods=['GET'])
def get_trending_news():
    url = 'https://finance.yahoo.com/markets/stocks/trending/'
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        trending_topics = []

        # Find table rows containing the trending data
        rows = soup.find_all('tr')[1:]  # Skip the header row
        for row in rows:
            columns = row.find_all('td')
            if len(columns) >= 4:  # Ensure there are at least 4 columns
                ticker = columns[0].text.strip()
                name = columns[1].text.strip()
                price = columns[2].text.strip()
                change = columns[3].text.strip()

                trending_topics.append({
                    'ticker': ticker,
                    'name': name,
                    'price': price,
                    'change': change
                })
        return jsonify(trending_topics)
    else:
        return jsonify({'error': 'Unable to fetch trending news'}), 500


@app.route('/api/ranked-recom', methods=['POST'])
def get_ranked_recommendations():
    data = request.json
    risk_tolerance = data.get("risk_tolerance", 0.5)
    investment_horizon = data.get("investment_horizon", 1)
    tickers = data.get("tickers", [])

    if not tickers:
        return jsonify({"error": "Tickers are required"}), 400

    recommendations = []
    try:
        for ticker in tickers:
            stock_data = yf.Ticker(ticker)
            hist = stock_data.history(period="1y")  # Get 1 year data for returns

            # Calculate returns and volatility (Sharpe Ratio)
            daily_returns = hist['Close'].pct_change().dropna()
            average_return = daily_returns.mean() * 252  # Annualized return
            volatility = daily_returns.std() * np.sqrt(252)  # Annualized volatility
            sharpe_ratio = (average_return - 0.02) / volatility  # Assuming a fixed risk-free rate for now

            # Calculate beta (CAPM)
            sp500 = yf.Ticker("^GSPC")
            market_hist = sp500.history(period="1y")
            market_returns = market_hist['Close'].pct_change().dropna()
            beta = np.cov(daily_returns, market_returns)[0][1] / np.var(market_returns)

            # Expected return (CAPM)
            capm_return = 0.02 + beta * (0.07 - 0.02)

            # Combine Sharpe Ratio and CAPM to form recommendation score
            recommendation_score = sharpe_ratio + capm_return

            recommendations.append({
                "ticker": ticker,
                "sharpe_ratio": sharpe_ratio,
                "capm_return": capm_return,
                "recommendation_score": recommendation_score
            })

        # Sort recommendations based on recommendation score
        sorted_recommendations = sorted(recommendations, key=lambda x: x['recommendation_score'], reverse=True)

        return jsonify(sorted_recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/recommendation', methods=['POST'])
def get_recommendation():
    data = request.json
    tickers = data.get("tickers")
    risk_free_rate = data.get("risk_free_rate", 0.02)  # Default risk-free rate
    market_return = data.get("market_return", 0.07)    # Default market return

    if not tickers:
        return jsonify({"error": "Tickers are required"}), 400

    recommendations = []

    try:
        for ticker in tickers:
            stock_data = yf.Ticker(ticker)
            hist = stock_data.history(period="1y")  # Get 1 year data for returns

            # Calculate returns and volatility (Sharpe Ratio)
            daily_returns = hist['Close'].pct_change().dropna()
            average_return = daily_returns.mean() * 252  # Annualized return
            volatility = daily_returns.std() * np.sqrt(252)  # Annualized volatility
            sharpe_ratio = (average_return - risk_free_rate) / volatility

            # Calculate beta (CAPM)
            # Using market index data like S&P 500 for beta calculation
            sp500 = yf.Ticker("^GSPC")
            market_hist = sp500.history(period="1y")
            market_returns = market_hist['Close'].pct_change().dropna()
            beta = np.cov(daily_returns, market_returns)[0][1] / np.var(market_returns)

            # Expected return (CAPM)
            capm_return = risk_free_rate + beta * (market_return - risk_free_rate)

            # Combine Sharpe Ratio and CAPM to form recommendation score
            recommendation_score = sharpe_ratio + capm_return

            recommendations.append({
                "ticker": ticker,
                "sharpe_ratio": sharpe_ratio,
                "capm_return": capm_return,
                "recommendation_score": recommendation_score
            })

        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
