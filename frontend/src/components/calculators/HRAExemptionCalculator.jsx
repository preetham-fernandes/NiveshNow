import React, { useState, useEffect } from "react";

const HRAExemptionCalculator = () => {
  // Input state variables
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(25000);
  const [isMetroCity, setIsMetroCity] = useState(true);
  const [location, setLocation] = useState("metro");
  const [monthlyCalculation, setMonthlyCalculation] = useState(true);
  
  // Result state variables
  const [exemptedHRA, setExemptedHRA] = useState(0);
  const [taxableHRA, setTaxableHRA] = useState(0);
  const [calculationBreakdown, setCalculationBreakdown] = useState([]);
  
  // Calculate HRA exemption whenever inputs change
  useEffect(() => {
    calculateHRAExemption();
  }, [basicSalary, hraReceived, rentPaid, isMetroCity, location, monthlyCalculation]);
  
  // Handle location change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    setIsMetroCity(value === "metro");
  };
  
  // Calculate HRA exemption
  const calculateHRAExemption = () => {
    // Convert all values to annual if inputs are monthly
    const annualBasic = monthlyCalculation ? basicSalary * 12 : basicSalary;
    const annualHRA = monthlyCalculation ? hraReceived * 12 : hraReceived;
    const annualRent = monthlyCalculation ? rentPaid * 12 : rentPaid;
    
    // Calculate 10% of basic salary
    const tenPercentOfBasic = annualRent - (0.1 * annualBasic);
    const rentMinusBasicPercent = tenPercentOfBasic > 0 ? tenPercentOfBasic : 0;
    
    // Calculate percentage of basic based on location (50% for metro, 40% for non-metro)
    const percentageOfBasic = isMetroCity ? 0.5 * annualBasic : 0.4 * annualBasic;
    
    // Calculate the minimum of the three conditions
    const minValue = Math.min(
      annualHRA,
      rentMinusBasicPercent,
      percentageOfBasic
    );
    
    // Set the result
    setExemptedHRA(minValue);
    setTaxableHRA(annualHRA - minValue);
    
    // Prepare calculation breakdown
    setCalculationBreakdown([
      {
        condition: "HRA Received",
        value: annualHRA,
        monthly: monthlyCalculation ? hraReceived : (annualHRA / 12).toFixed(2)
      },
      {
        condition: `${isMetroCity ? "50%" : "40%"} of Basic Salary`,
        value: percentageOfBasic,
        monthly: monthlyCalculation ? (percentageOfBasic / 12).toFixed(2) : (percentageOfBasic / 12).toFixed(2)
      },
      {
        condition: "Rent paid - 10% of Basic Salary",
        value: rentMinusBasicPercent,
        monthly: monthlyCalculation ? (rentMinusBasicPercent / 12).toFixed(2) : (rentMinusBasicPercent / 12).toFixed(2)
      }
    ]);
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
      <h2 className="text-2xl font-bold mb-6">HRA Exemption Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-4">
            <label className="block mb-2">
              <input
                type="radio"
                checked={monthlyCalculation}
                onChange={() => setMonthlyCalculation(true)}
                className="mr-2"
              />
              Monthly Values
            </label>
            
            <label className="block">
              <input
                type="radio"
                checked={!monthlyCalculation}
                onChange={() => setMonthlyCalculation(false)}
                className="mr-2"
              />
              Annual Values
            </label>
          </div>
          
          <label className="block text-gray-700 mb-4">
            {monthlyCalculation ? "Basic Salary (Monthly)" : "Basic Salary (Annual)"}
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="0"
            />
          </label>
          
          <label className="block text-gray-700 mb-4">
            {monthlyCalculation ? "HRA Received (Monthly)" : "HRA Received (Annual)"}
            <input
              type="number"
              value={hraReceived}
              onChange={(e) => setHraReceived(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="0"
            />
          </label>
          
          <label className="block text-gray-700 mb-4">
            {monthlyCalculation ? "Rent Paid (Monthly)" : "Rent Paid (Annual)"}
            <input
              type="number"
              value={rentPaid}
              onChange={(e) => setRentPaid(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
              min="0"
            />
          </label>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">City Category</label>
            <select
              value={location}
              onChange={handleLocationChange}
              className="w-full p-2 border rounded"
            >
              <option value="metro">Metro City (Delhi, Mumbai, Kolkata, Chennai)</option>
              <option value="non-metro">Non-Metro City</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="p-4 bg-blue-50 rounded mb-6">
            <h3 className="font-semibold text-lg mb-4">HRA Exemption Results</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600">Exempted HRA (Annual)</p>
                <p className="text-xl font-bold">{formatCurrency(exemptedHRA)}</p>
                {monthlyCalculation && (
                  <p className="text-sm text-gray-600">
                    Monthly: {formatCurrency(exemptedHRA / 12)}
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-gray-600">Taxable HRA (Annual)</p>
                <p className="text-xl font-bold">{formatCurrency(taxableHRA)}</p>
                {monthlyCalculation && (
                  <p className="text-sm text-gray-600">
                    Monthly: {formatCurrency(taxableHRA / 12)}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold text-lg mb-2">How HRA Exemption Works</h3>
            <p className="mb-2">The exemption is the minimum of the following three amounts:</p>
            <ol className="list-decimal pl-5 mb-4">
              <li>Actual HRA received</li>
              <li>Rent paid minus 10% of basic salary</li>
              <li>{isMetroCity ? "50%" : "40%"} of basic salary (for {isMetroCity ? "metro" : "non-metro"} cities)</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Calculation Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Condition</th>
                <th className="py-2 px-4 border">Annual Value</th>
                <th className="py-2 px-4 border">Monthly Value</th>
              </tr>
            </thead>
            <tbody>
              {calculationBreakdown.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-4 border">{item.condition}</td>
                  <td className="py-2 px-4 border">{formatCurrency(item.value)}</td>
                  <td className="py-2 px-4 border">{formatCurrency(Number(item.monthly))}</td>
                </tr>
              ))}
              <tr className="bg-green-50 font-semibold">
                <td className="py-2 px-4 border">Minimum (Exempted HRA)</td>
                <td className="py-2 px-4 border">{formatCurrency(exemptedHRA)}</td>
                <td className="py-2 px-4 border">{formatCurrency(exemptedHRA / 12)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 mx-auto my-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 border-b pb-2">
                What is HRA?                </h1>
                <p className="text-gray-700 leading-relaxed">
                House Rent Allowance (HRA) is a component of the salary package provided by employers to assist employees in meeting the latter’s rental accommodation expenses.                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                HRA serves to offset the financial burden of renting a house for those who don’t own a residential property. The Income-Tax Act allows for the exemption of a portion of the HRA from taxable income, subject to certain conditions.                </p>
            </div>
    </div>
  );
};

export default HRAExemptionCalculator;