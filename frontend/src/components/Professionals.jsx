'use client'

import React, { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { useTheme } from "next-themes"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaoZ-WmRy_f3jEsKbYHR1G9SEMRPmR04c",
  authDomain: "niveshnow-afafa.firebaseapp.com",
  projectId: "niveshnow-afafa",
  storageBucket: "niveshnow-afafa.appspot.com",
  messagingSenderId: "117795127643",
  appId: "1:117795127643:web:7d5f2db2896726daeada7e",
  measurementId: "G-HHB28MM0FJ",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function Professionals() {
  const [experts, setExperts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const expertCollection = collection(db, "experts")
        const expertSnapshot = await getDocs(expertCollection)
        const expertList = expertSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setExperts(expertList)
      } catch (err) {
        setError("Failed to fetch experts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchExperts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Professional Experts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Certifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experts.map((expert) => (
                <TableRow key={expert.id}>
                  <TableCell>{expert.email}</TableCell>
                  <TableCell>{expert.expertise}</TableCell>
                  <TableCell>{expert.experience}</TableCell>
                  <TableCell>
                    {Array.isArray(expert.certifications) 
                      ? expert.certifications.join(", ") 
                      : "None"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}