import React, { useState } from "react";
import NPSCalculator from "./calculators/NPScalculator";
// import TaxRegimeCalculator from "./calculators/TaxRegimeCalculator";
import FloatingInterestCalculator from "./calculators/FloatingInterestCalculator";
// import MutualFundOverlapCalculator from "./calculators/MutualFundOverlapCalculator";
// import InsuranceSurrenderCalculator from "./calculators/InsuranceSurrenderCalculator";
// import MutualFundCommissionCalculator from "./calculators/MutualFundCommissionCalculator";
import RetirementCorpusCalculator from "./calculators/RetirementCorpusCalculator";
// import LoanRefinanceCalculator from "./calculators/LoanRefinanceCalculator";
// import InsuranceCommissionCalculator from "./calculators/InsuranceCommissionCalculator";
// import IncreasingSIPCalculator from "./calculators/IncreasingSIPCalculator";
import HRAExemptionCalculator from "./calculators/HRAExemptionCalculator";

const iconPaths = {
  tax: {
    element: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 2v4"></path>
        <path d="M8 2v4"></path>
        <path d="M2 11h20"></path>
      </>
    )
  },
  interest: {
    element: (
      <>
        <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
        <line x1="2" y1="20" x2="2" y2="20"></line>
      </>
    )
  },
  mutual: {
    element: (
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </>
    )
  },
  insurance: {
    element: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    )
  },
  retirement: {
    element: (
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
      </>
    )
  },
  loan: {
    element: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
        <circle cx="12" cy="12" r="2"></circle>
        <path d="M6 12h.01M18 12h.01"></path>
      </>
    )
  },
  sip: {
    element: (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </>
    )
  },
  hra: {
    element: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </>
    )
  },
  nps: {
    element: (
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
        <line x1="12" y1="6" x2="12" y2="18"></line>
      </>
    )
  }
};

const Icon = ({ type }) => {
  return (
    <div className={`w-12 h-12 flex items-center justify-center text-${type}-500`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconPaths[type]?.element}
      </svg>
    </div>
  );
};

const CalculatorCard = ({ title, iconType, onClick, hasUpdatedBadge = false }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white text-left w-full"
    >
      <div className="relative">
        <Icon type={iconType} />
        {hasUpdatedBadge && (
          <span className="absolute -top-2 -right-2 bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded">
            Updated
          </span>
        )}
      </div>
      <span className="ml-4 font-medium text-gray-800">{title}</span>
    </button>
  );
};

export default function FinancialCalculators() {
  const [activeCalculator, setActiveCalculator] = useState(null);

  const calculators = [
    { title: "NPS Calculator", iconType: "nps", component: NPSCalculator },
    { title: "Floating Interest Rate Calculator", iconType: "interest", component: FloatingInterestCalculator },
    { title: "Retirement Corpus Calculator", iconType: "retirement", component: RetirementCorpusCalculator},
    { title: "HRA Exemption Calculator", iconType: "hra", component: HRAExemptionCalculator },
    { title: "Old vs New Tax Regime Calculator", iconType: "tax" },
    { title: "Mutual Fund Overlap Calculator", iconType: "mutual" },
    { title: "Insurance Surrender Value Calculator", iconType: "insurance" },
    { title: "Mutual Fund Commission Analyser", iconType: "mutual"},
    { title: "Loan Refinance Calculator", iconType: "loan" },
    { title: "Insurance Commission Analyser", iconType: "insurance" },
    { title: "Increasing SIP Contribution Calculator", iconType: "sip" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-4xl font-bold mb-2">Financial Calculators & Tools</h1>
      <p className="text-gray-600 mb-8">A set of tools designed to make personal financial calculations effortless</p>
      {activeCalculator ? (
        <div>
          <button onClick={() => setActiveCalculator(null)} className="mb-4 text-blue-600 hover:underline">
            ← Back to all calculators
          </button>
          {activeCalculator}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              title={calc.title}
              iconType={calc.iconType}
              hasUpdatedBadge={calc.hasUpdatedBadge}
              onClick={() => setActiveCalculator(<calc.component />)}
            />
          ))}
        </div>
      )}
    </div>
  );
}