"use client";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
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

export default function ExpertDashboard() {
  const [experts, setExperts] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("userEmail");
    if (emailFromStorage) {
      setUserEmail(emailFromStorage);
      console.log("User Email:", emailFromStorage); // Debugging line
    }

    const fetchExperts = async () => {
      const expertCollection = collection(db, "experts");
      const expertSnapshot = await getDocs(expertCollection);
      const expertList = expertSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperts(expertList);
      console.log("Experts fetched:", expertList); // Debugging line
    };

    fetchExperts();
  }, []);

  const userExpert = experts.find(expert => expert.email === userEmail);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Expert Dashboard</h2>
        </div>
        <div className="overflow-hidden rounded-lg shadow-lg border border-gray-700 bg-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Expertise</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Experience</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Certifications</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {userExpert ? (
                <tr key={userExpert.id}>
                  <td className="px-4 py-2 text-sm text-gray-300">{userExpert.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-300">{userExpert.expertise}</td>
                  <td className="px-4 py-2 text-sm text-gray-300">{userExpert.experience}</td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    {Array.isArray(userExpert.certifications) 
                      ? userExpert.certifications.join(", ") 
                      : "None"}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-sm text-gray-300 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
