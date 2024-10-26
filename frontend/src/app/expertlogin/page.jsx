"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaoZ-WmRy_f3jEsKbYHR1G9SEMRPmR04c",
  authDomain: "niveshnow-afafa.firebaseapp.com",
  projectId: "niveshnow-afafa",
  storageBucket: "niveshnow-afafa.appspot.com",
  messagingSenderId: "117795127643",
  appId: "1:117795127643:web:7d5f2db2896726daeada7e",
  measurementId: "G-HHB28MM0FJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ExpertLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    expertise: "",
    experience: "",
    certifications: [],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      try {
        // Add expert data to Firestore (excluding password for security)
        const docRef = await addDoc(collection(db, "experts"), {
          email: formData.email,
          expertise: formData.expertise,
          experience: formData.experience,
          certifications: formData.certifications,
        });

        // Redirect to expert dashboard after successful submission
        router.push(`/expertdashboard?id=${docRef.id}`);
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("There was an error saving your data. Please try again.");
      }
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const progress = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Expert Login</h2>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-black bg-white">
              Step {step} of 2
            </span>
            <span className="text-xs font-semibold inline-block text-white">
              {progress}%
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 rounded-full bg-gray-700">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-white transition-all duration-700 ease-in-out transform"
            />
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div>
                <label htmlFor="expertise" className="sr-only">Field of Expertise</label>
                <select
                  id="expertise"
                  name="expertise"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                  value={formData.expertise}
                  onChange={handleChange}
                >
                  <option value="">Select Field of Expertise</option>
                  <option value="Stock Analysis">Stock Analysis</option>
                  <option value="Portfolio Management">Portfolio Management</option>
                  <option value="Risk Assessment">Risk Assessment</option>
                  <option value="Financial Planning">Financial Planning</option>
                  <option value="Investment Strategies">Investment Strategies</option>
                  <option value="Tax Advisory">Tax Advisory</option>
                  <option value="Retirement Planning">Retirement Planning</option>
                  <option value="Behavioral Finance">Behavioral Finance</option>
                  <option value="Corporate Finance">Corporate Finance</option>
                  <option value="Asset Management">Asset Management</option>
                </select>
              </div>
              <div>
                <label htmlFor="experience" className="sr-only">Years of Experience</label>
                <select
                  id="experience"
                  name="experience"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="">Select Years of Experience</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="rounded-md shadow-sm">
              <label className="block text-sm font-medium text-gray-400 mb-2">Certifications</label>
              <div className="space-y-2">
                {[
                  "Certified Financial Analyst (CFA)",
                  "Certified Public Accountant (CPA)",
                  "Certified Financial Planner (CFP)",
                  "Financial Risk Manager (FRM)",
                  "Chartered Alternative Investment Analyst (CAIA)",
                  "Chartered Financial Consultant (ChFC)",
                  "Certified Investment Management Analyst (CIMA)",
                  "Certified International Investment Analyst (CIIA)",
                  "Certified Treasury Professional (CTP)",
                  "Accredited Investment Fiduciary (AIF)",
                  "Chartered Market Technician (CMT)",
                  "Certified Credit Risk Analyst (CCRA)",
                  "Certified Fund Specialist (CFS)",
                  "Certified Wealth Strategist (CWS)",
                  "Certificate in Quantitative Finance (CQF)",
                ].map((cert) => (
                  <label key={cert} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="certifications"
                      value={cert}
                      checked={formData.certifications.includes(cert)}
                      onChange={handleChange}
                      className="mr-2 leading-tight"
                    />
                    <span className="text-gray-400">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={step === 1 ? handleSubmit : handleBack}
            >
              {step === 1 ? "Next" : "Back"}
            </button>
            {step === 2 && (
              <button
                type="submit"
                className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
