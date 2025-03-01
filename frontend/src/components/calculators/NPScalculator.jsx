import React, { useState, useEffect } from "react";

const NPSCalculator = () => {
    // Input state variables
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [age, setAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [expectedReturns, setExpectedReturns] = useState(10);
    const [annualIncrease, setAnnualIncrease] = useState(5);

    // Result state variables
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [maturityValue, setMaturityValue] = useState(0);
    const [yearlyBreakdown, setYearlyBreakdown] = useState([]);

    // Calculate results when inputs change
    useEffect(() => {
        calculateNPS();
    }, [monthlyContribution, age, retirementAge, expectedReturns, annualIncrease]);

    const calculateNPS = () => {
        const investmentYears = retirementAge - age;
        let totalContribution = 0;
        let totalValue = 0;
        let currentMonthlyContribution = monthlyContribution;
        let yearData = [];

        for (let year = 1; year <= investmentYears; year++) {
            let yearlyContribution = currentMonthlyContribution * 12;
            totalContribution += yearlyContribution;

            // Calculate returns for this year (including on existing corpus)
            const yearlyReturns = (totalValue + yearlyContribution / 2) * (expectedReturns / 100);
            totalValue = totalValue + yearlyContribution + yearlyReturns;

            // Store yearly data for breakdown
            yearData.push({
                year,
                age: age + year,
                yearlyContribution,
                totalContribution,
                yearlyReturns,
                totalValue: Math.round(totalValue)
            });

            // Increase contribution for next year
            currentMonthlyContribution += currentMonthlyContribution * (annualIncrease / 100);
        }

        setTotalInvestment(Math.round(totalContribution));
        setMaturityValue(Math.round(totalValue));
        setYearlyBreakdown(yearData);
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">NPS Calculator</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-gray-700 mb-2">
                        Monthly Contribution (₹)
                        <input
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded"
                            min="500"
                        />
                    </label>

                    <label className="block text-gray-700 mb-2 mt-4">
                        Current Age (years)
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded"
                            min="18"
                            max="59"
                        />
                    </label>

                    <label className="block text-gray-700 mb-2 mt-4">
                        Retirement Age (years)
                        <input
                            type="number"
                            value={retirementAge}
                            onChange={(e) => setRetirementAge(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded"
                            min={age + 1}
                            max="70"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">
                        Expected Returns (% per annum)
                        <input
                            type="number"
                            value={expectedReturns}
                            onChange={(e) => setExpectedReturns(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded"
                            min="1"
                            max="15"
                            step="0.1"
                        />
                    </label>

                    <label className="block text-gray-700 mb-2 mt-4">
                        Annual Increase in Contribution (%)
                        <input
                            type="number"
                            value={annualIncrease}
                            onChange={(e) => setAnnualIncrease(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded"
                            min="0"
                            max="20"
                            step="0.1"
                        />
                    </label>

                    <div className="mt-8 p-4 bg-blue-50 rounded">
                        <h3 className="font-semibold text-lg mb-2">Results</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Total Investment</p>
                                <p className="text-xl font-bold">{formatCurrency(totalInvestment)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Maturity Value</p>
                                <p className="text-xl font-bold">{formatCurrency(maturityValue)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Year-wise Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Year</th>
                                <th className="py-2 px-4 border">Age</th>
                                <th className="py-2 px-4 border">Yearly Contribution</th>
                                <th className="py-2 px-4 border">Returns</th>
                                <th className="py-2 px-4 border">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearlyBreakdown.map((data, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                    <td className="py-2 px-4 border">{data.year}</td>
                                    <td className="py-2 px-4 border">{data.age}</td>
                                    <td className="py-2 px-4 border">{formatCurrency(data.yearlyContribution)}</td>
                                    <td className="py-2 px-4 border">{formatCurrency(data.yearlyReturns)}</td>
                                    <td className="py-2 px-4 border">{formatCurrency(data.totalValue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mx-auto my-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 border-b pb-2">
                    What is NPS?
                </h1>
                <p className="text-gray-700 leading-relaxed">
                    The National Pension System (NPS) is a government-introduced scheme for retirement planning. It involves contributing to a pension fund during employment to build a retirement corpus.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                    NPS offers tax benefits, with an extra <span className="font-semibold text-green-600">₹50,000</span> deduction besides <span className="font-semibold text-green-600">₹1.50 lakh</span> under section 80C. At retirement after age 60, the withdrawals are tax-free. <span className="font-semibold">60%</span> can be withdrawn as a lump sum, while the rest must be invested in annuity plans.
                </p>
            </div>

        </div>
    );
};

export default NPSCalculator;