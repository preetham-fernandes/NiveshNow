import React, { useState, useEffect } from "react";

const FloatingInterestCalculator = () => {
  // Input state variables
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [initialTenure, setInitialTenure] = useState(20);
  const [initialRate, setInitialRate] = useState(8.5);
  const [rateChanges, setRateChanges] = useState([
    { year: 3, newRate: 9.0 },
    { year: 5, newRate: 8.0 }
  ]);
  const [newRateYear, setNewRateYear] = useState(1);
  const [newRateValue, setNewRateValue] = useState(8.75);

  // Result state variables
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    totalInterest: 0,
    totalPayment: 0,
    averageRate: 0,
  });

  // Calculate results when inputs change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, initialTenure, initialRate, rateChanges]);

  const addRateChange = () => {
    if (newRateYear > 0 && newRateYear < initialTenure) {
      // Check if year already exists and replace it, or add new
      const exists = rateChanges.findIndex(change => change.year === newRateYear);
      
      if (exists >= 0) {
        const newRateChanges = [...rateChanges];
        newRateChanges[exists] = { year: newRateYear, newRate: newRateValue };
        setRateChanges(newRateChanges);
      } else {
        setRateChanges([...rateChanges, { year: newRateYear, newRate: newRateValue }]
          .sort((a, b) => a.year - b.year));
      }
      
      setNewRateYear(1);
      setNewRateValue(8.75);
    }
  };

  const removeRateChange = (year) => {
    setRateChanges(rateChanges.filter(change => change.year !== year));
  };

  // Calculate EMI with given principal, rate, and time
  const calculateEMI = (principal, rate, time) => {
    const monthlyRate = rate / 12 / 100;
    const months = time * 12;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const calculateLoan = () => {
    let remainingPrincipal = loanAmount;
    let monthlyResults = [];
    let totalInterestPaid = 0;
    let totalRateSum = 0;
    let currentRate = initialRate;
    let rateChangeYears = [...rateChanges].sort((a, b) => a.year - b.year);
    
    // Add initial year as year 0
    rateChangeYears = [{ year: 0, newRate: initialRate }, ...rateChangeYears];
    
    // Calculate for each period between rate changes
    for (let i = 0; i < rateChangeYears.length; i++) {
      const startYear = rateChangeYears[i].year;
      const endYear = (i < rateChangeYears.length - 1) ? rateChangeYears[i + 1].year : initialTenure;
      const periodYears = endYear - startYear;
      
      if (periodYears <= 0) continue;
      
      currentRate = rateChangeYears[i].newRate;
      const monthlyEMI = calculateEMI(remainingPrincipal, currentRate, initialTenure - startYear);
      
      // For each year in this rate period
      for (let year = startYear + 1; year <= endYear; year++) {
        let yearlyPrincipalPaid = 0;
        let yearlyInterestPaid = 0;
        
        // For each month in this year
        for (let month = 1; month <= 12; month++) {
          if ((year - 1) * 12 + month > initialTenure * 12) break;
          
          const monthlyInterest = (remainingPrincipal * currentRate) / 1200;
          const monthlyPrincipal = monthlyEMI - monthlyInterest;
          
          yearlyPrincipalPaid += monthlyPrincipal;
          yearlyInterestPaid += monthlyInterest;
          totalInterestPaid += monthlyInterest;
          
          remainingPrincipal -= monthlyPrincipal;
          
          if (remainingPrincipal <= 0) {
            remainingPrincipal = 0;
            break;
          }
        }
        
        monthlyResults.push({
          year,
          interestRate: currentRate,
          principalPaid: yearlyPrincipalPaid,
          interestPaid: yearlyInterestPaid,
          totalPayment: yearlyPrincipalPaid + yearlyInterestPaid,
          remainingPrincipal: Math.max(0, remainingPrincipal)
        });
        
        totalRateSum += currentRate;
        
        if (remainingPrincipal <= 0) break;
      }
      
      if (remainingPrincipal <= 0) break;
    }
    
    setResults(monthlyResults);
    setSummary({
      totalInterest: totalInterestPaid,
      totalPayment: loanAmount + totalInterestPaid,
      averageRate: totalRateSum / initialTenure
    });
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
      <h2 className="text-2xl font-bold mb-6">Floating Interest Rate Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 mb-2">
            Loan Amount (₹)
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="10000"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Initial Tenure (years)
            <input
              type="number"
              value={initialTenure}
              onChange={(e) => setInitialTenure(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="1"
              max="30"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Initial Interest Rate (% per annum)
            <input
              type="number"
              value={initialRate}
              onChange={(e) => setInitialRate(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="1"
              max="20"
              step="0.1"
            />
          </label>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Interest Rate Changes</h3>
          <div className="flex gap-2 mb-2">
            <label className="block text-gray-700 flex-1">
              Year
              <input
                type="number"
                value={newRateYear}
                onChange={(e) => setNewRateYear(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded"
                min="1"
                max={initialTenure - 1}
              />
            </label>
            
            <label className="block text-gray-700 flex-1">
              New Rate (%)
              <input
                type="number"
                value={newRateValue}
                onChange={(e) => setNewRateValue(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded"
                min="1"
                max="20"
                step="0.1"
              />
            </label>
            
            <button 
              onClick={addRateChange} 
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <div className="mt-4 border p-3 rounded max-h-48 overflow-y-auto">
            {rateChanges.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1">Year</th>
                    <th className="text-left p-1">New Rate (%)</th>
                    <th className="text-left p-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rateChanges.map((change, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-1">{change.year}</td>
                      <td className="p-1">{change.newRate}%</td>
                      <td className="p-1">
                        <button 
                          onClick={() => removeRateChange(change.year)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center">No rate changes added.</p>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-lg mb-2">Results Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Total Interest</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalInterest)}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Payment</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalPayment)}</p>
              </div>
              <div>
                <p className="text-gray-600">Avg. Interest Rate</p>
                <p className="text-xl font-bold">{summary.averageRate.toFixed(2)}%</p>
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
                <th className="py-2 px-4 border">Interest Rate</th>
                <th className="py-2 px-4 border">Principal Paid</th>
                <th className="py-2 px-4 border">Interest Paid</th>
                <th className="py-2 px-4 border">Total Payment</th>
                <th className="py-2 px-4 border">Remaining Principal</th>
              </tr>
            </thead>
            <tbody>
              {results.map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-4 border">{data.year}</td>
                  <td className="py-2 px-4 border">{data.interestRate}%</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.principalPaid)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.interestPaid)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.totalPayment)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.remainingPrincipal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mx-auto my-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 border-b pb-2">
                What is a Floating Interest Rate?
                </h1>
                <p className="text-gray-700 leading-relaxed">
                A floating interest rate refers to the adjustment of the interest rate on a floating rate interest loan based on changes in the repo rate or the benchmark interest rate.                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                Understanding New RBI Guidelines
On 18th August 2023, the RBI issued guidelines concerning floating interest rate loans,prompted by “several consumer grievances related to elongation of loan tenor and/or increase in EMI amount, without proper communication with and/or consent of the borrowers”. As per the guidelines, lenders are advised to put in place an appropriate policy framework meeting the following requirements for implementation and compliance:


Offer choices to adjust your EMIs, your loan tenure, or a combination of both, or even allow prepayment of your existing loan.


Enable the switch to a fixed interest rate at the time of interest rate reset, per the lender's approved policy.


Disclose all charges involved in switching loans from floating to fixed rates, including any service or administrative fees.


Prevent negative amortisation when extending the loan tenure.


Provide clear, quarterly statements that detail, at a minimum, the principal and interest recovered, remaining EMIs, and the annualized rate of interest or Annual Percentage Rate (APR) for the entire loan tenure.

These guidelines apply to both existing and new loans, aiming to improve communication and offer more flexibility to borrowers.                </p>
            </div>
    </div>
  );
};

export default FloatingInterestCalculator;