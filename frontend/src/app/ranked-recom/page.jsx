// pages/recommendation.js
import { useState } from 'react';
import axios from 'axios';

const RecommendationPage = () => {
    const [totalInvestment, setTotalInvestment] = useState('');
    const [expectedPeriod, setExpectedPeriod] = useState('');
    const [roi, setRoi] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/recommendations', {
                total_investment: parseFloat(totalInvestment),
                expected_period: parseInt(expectedPeriod),
                roi: parseFloat(roi),
            });

            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    return (
        <div>
            <h1>Stock Recommendations</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Total Investment:</label>
                    <input
                        type="number"
                        value={totalInvestment}
                        onChange={(e) => setTotalInvestment(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Expected Portfolio Period (months):</label>
                    <input
                        type="number"
                        value={expectedPeriod}
                        onChange={(e) => setExpectedPeriod(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>ROI (%):</label>
                    <input
                        type="number"
                        value={roi}
                        onChange={(e) => setRoi(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Get Recommendations</button>
            </form>

            <h2>Recommendations</h2>
            <ul>
                {recommendations.map((stock) => (
                    <li key={stock.ticker}>
                        {stock.name} ({stock.ticker}): {stock.price} USD, {stock.shares.toFixed(2)} shares, Total Value: {stock.total_value.toFixed(2)} USD
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecommendationPage;
