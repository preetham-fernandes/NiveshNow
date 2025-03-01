import React, { useState, useEffect } from "react";

const RetirementCorpusCalculator = () => {
  // Input state variables
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [existingCorpus, setExistingCorpus] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(6);
  const [preRetirementReturn, setPreRetirementReturn] = useState(12);
  const [postRetirementReturn, setPostRetirementReturn] = useState(8);
  const [annualIncreaseInSavings, setAnnualIncreaseInSavings] = useState(5);
  
  // Result state variables
  const [requiredCorpus, setRequiredCorpus] = useState(0);
  const [monthlySavingsNeeded, setMonthlySavingsNeeded] = useState(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);

  // Calculate results when inputs change
  useEffect(() => {
    calculateRetirementNeeds();
  }, [
    currentAge, retirementAge, lifeExpectancy, monthlyExpense, 
    existingCorpus, inflationRate, preRetirementReturn, 
    postRetirementReturn, annualIncreaseInSavings
  ]);

  const calculateRetirementNeeds = () => {
    // Validate inputs
    if (retirementAge <= currentAge || lifeExpectancy <= retirementAge) {
      return;
    }

    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Calculate monthly expense at retirement considering inflation
    const monthlyExpenseAtRetirement = monthlyExpense * 
      Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Calculate yearly expense at retirement
    const yearlyExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
    
    // Calculate corpus needed at retirement
    let corpus = 0;
    let inflationAdjustedExpense = yearlyExpenseAtRetirement;
    let yearlyData = [];
    
    // Calculate corpus needed for each year in retirement
    for (let i = 0; i < yearsInRetirement; i++) {
      if (i > 0) {
        inflationAdjustedExpense *= (1 + inflationRate / 100);
      }
      
      corpus = (corpus + inflationAdjustedExpense) / (1 + postRetirementReturn / 100);
    }
    
    // Final corpus needed at retirement
    const finalCorpusNeeded = corpus * (1 + postRetirementReturn / 100);
    setRequiredCorpus(finalCorpusNeeded);
    
    // Calculate how much current corpus will grow to by retirement
    const futureValueOfExistingCorpus = existingCorpus * 
      Math.pow(1 + preRetirementReturn / 100, yearsToRetirement);
    
    // Calculate additional corpus needed
    const additionalCorpusNeeded = Math.max(0, finalCorpusNeeded - futureValueOfExistingCorpus);
    
    // Calculate monthly savings needed
    let monthlySaving = 0;
    if (yearsToRetirement > 0 && additionalCorpusNeeded > 0) {
      // Use complex calculation for increasing savings
      let totalSavings = 0;
      let monthlySavingStart = 1000; // Start with a guess
      
      // Use binary search to find the right monthly savings
      let low = 0;
      let high = additionalCorpusNeeded / (yearsToRetirement * 12);
      
      while (Math.abs(high - low) > 1) {
        monthlySavingStart = (low + high) / 2;
        totalSavings = 0;
        let currentMonthlySaving = monthlySavingStart;
        
        for (let year = 1; year <= yearsToRetirement; year++) {
          for (let month = 1; month <= 12; month++) {
            totalSavings += currentMonthlySaving;
            totalSavings *= (1 + preRetirementReturn / 100 / 12);
          }
          currentMonthlySaving *= (1 + annualIncreaseInSavings / 100);
        }
        
        if (totalSavings < additionalCorpusNeeded) {
          low = monthlySavingStart;
        } else {
          high = monthlySavingStart;
        }
      }
      
      monthlySaving = Math.ceil(monthlySavingStart);
    }
    
    setMonthlySavingsNeeded(monthlySaving);
    
    // Create yearly breakdown
    let breakdownData = [];
    let currentCorpus = existingCorpus;
    let currentMonthlySaving = monthlySaving;
    
    // Pre-retirement phase
    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearlyContribution = currentMonthlySaving * 12;
      const yearlyReturns = (currentCorpus + yearlyContribution / 2) * (preRetirementReturn / 100);
      currentCorpus = currentCorpus + yearlyContribution + yearlyReturns;
      
      breakdownData.push({
        year: currentAge + year,
        phase: "Accumulation",
        savings: yearlyContribution,
        returns: yearlyReturns,
        corpusValue: currentCorpus,
        expense: 0,
        inflation: 0
      });
      
      currentMonthlySaving *= (1 + annualIncreaseInSavings / 100);
    }
    
    // Post-retirement phase
    let currentYearlyExpense = yearlyExpenseAtRetirement;
    
    for (let year = 1; year <= yearsInRetirement; year++) {
      const yearlyReturns = currentCorpus * (postRetirementReturn / 100);
      const inflationAdjustment = currentYearlyExpense * (inflationRate / 100);
      
      breakdownData.push({
        year: retirementAge + year,
        phase: "Withdrawal",
        savings: 0,
        returns: yearlyReturns,
        corpusValue: currentCorpus - currentYearlyExpense + yearlyReturns,
        expense: currentYearlyExpense,
        inflation: inflationAdjustment
      });
      
      currentCorpus = currentCorpus - currentYearlyExpense + yearlyReturns;
      currentYearlyExpense += inflationAdjustment;
    }
    
    setYearlyBreakdown(breakdownData);
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
      <h2 className="text-2xl font-bold mb-6">Retirement Corpus Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 mb-2">
            Current Age
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="18"
              max={retirementAge - 1}
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Retirement Age
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min={currentAge + 1}
              max={lifeExpectancy - 1}
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Life Expectancy
            <input
              type="number"
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min={retirementAge + 1}
              max="110"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Current Monthly Expense (₹)
            <input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="1000"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Existing Retirement Corpus (₹)
            <input
              type="number"
              value={existingCorpus}
              onChange={(e) => setExistingCorpus(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="0"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">
            Expected Inflation Rate (% per annum)
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="1"
              max="15"
              step="0.1"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Pre-Retirement Return (% per annum)
            <input
              type="number"
              value={preRetirementReturn}
              onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="1"
              max="20"
              step="0.1"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Post-Retirement Return (% per annum)
            <input
              type="number"
              value={postRetirementReturn}
              onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="1"
              max="15"
              step="0.1"
            />
          </label>
          
          <label className="block text-gray-700 mb-2 mt-4">
            Annual Increase in Savings (%)
            <input
              type="number"
              value={annualIncreaseInSavings}
              onChange={(e) => setAnnualIncreaseInSavings(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="0"
              max="20"
              step="0.1"
            />
          </label>
          
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-lg mb-2">Results</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600">Retirement Corpus Required</p>
                <p className="text-xl font-bold">{formatCurrency(requiredCorpus)}</p>
              </div>
              <div>
                <p className="text-gray-600">Monthly Savings Needed</p>
                <p className="text-xl font-bold">{formatCurrency(monthlySavingsNeeded)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Year-wise Projection</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Phase</th>
                <th className="py-2 px-4 border">Savings</th>
                <th className="py-2 px-4 border">Returns</th>
                <th className="py-2 px-4 border">Expenses</th>
                <th className="py-2 px-4 border">Corpus Value</th>
              </tr>
            </thead>
            <tbody>
              {yearlyBreakdown.map((data, index) => (
                <tr key={index} className={data.phase === "Accumulation" ? "bg-green-50" : "bg-amber-50"}>
                  <td className="py-2 px-4 border">{data.year}</td>
                  <td className="py-2 px-4 border">{data.phase}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.savings)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.returns)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.expense)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(data.corpusValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mx-auto my-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 border-b pb-2">
                What does Retirement Corpus mean?                </h1>
                <p className="text-gray-700 leading-relaxed">
                Retirement corpus refers to the total amount of money or savings that an individual has accumulated by the time they retire to support their lifestyle and expenses after retirement. This corpus is crucial for ensuring that the individual has a financially secure and comfortable life after they stop earning a regular income.                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                The size of the retirement corpus would depend on various factors, including the individual's lifestyle choices, healthcare needs, inflation rates, and expected after retirement expenses, among others. It's advisable to plan and start building the retirement corpus well in advance to meet the financial goals set for the retirement years.                </p>
            </div>
    </div>
  );
};

export default RetirementCorpusCalculator;