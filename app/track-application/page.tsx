"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Search, Calendar, CheckCircle, Clock, XCircle, Dog, User, Syringe, DollarSign } from "lucide-react"

interface DogApplication {
  trackingNumber: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPhone: string
  ownerAddress: string
  ownerCity: string
  ownerZipCode: string
  dogName: string
  dogBreed: string
  dogColor: string
  dogGender: string
  dogAge: number
  dogWeight: number
  isSpayedNeutered: string
  rabiesVaccinationDate: string
  rabiesVaccinationExpiry: string
  veterinarianName: string
  veterinarianAddress: string
  licensePeriod: string
  licenseFee: number
}

export default function TrackApplication() {
  const searchParams = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [application, setApplication] = useState<DogApplication | null>(null)
  const [isSearched, setIsSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const urlTrackingNumber = searchParams.get("id")
    if (urlTrackingNumber) {
      setTrackingNumber(urlTrackingNumber)
      // Auto-search if tracking number is in URL
      setTimeout(() => {
        searchApplication(urlTrackingNumber)
      }, 100)
    }
  }, [searchParams])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Invalid date"
    }
  }

  const searchApplication = (searchId?: string) => {
    const idToSearch = searchId || trackingNumber
    if (!idToSearch.trim() || !isClient) return

    setIsLoading(true)
    setIsSearched(true)

    setTimeout(() => {
      try {
        const storedApplications = localStorage.getItem("dogLicenseApplications")
        if (storedApplications) {
          const applications: DogApplication[] = JSON.parse(storedApplications)
          const foundApplication = applications.find((app) => app.trackingNumber === idToSearch.trim())
          setApplication(foundApplication || null)
        } else {
          setApplication(null)
        }
      } catch (error) {
        console.error("[v0] Error reading from localStorage:", error)
        setApplication(null)
      }
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchApplication()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Track Your Dog License Application</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enter your tracking number to check the status of your application.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900 dark:text-white">Find Your Application</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Enter your unique tracking number below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="e.g., DOG-1234567890-5678"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-lg py-3 border-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading || !isClient}
              />
            </div>
            <Button
              onClick={() => searchApplication()}
              disabled={isLoading || !trackingNumber.trim() || !isClient}
              className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track Application
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {isSearched && (
          <div className="space-y-6">
            {isLoading ? (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Searching for your application...</p>
                  </div>
                </CardContent>
              </Card>
            ) : application ? (
              <>
                {/* Status Card */}
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl text-gray-900 dark:text-white mb-2">
                          Application Status
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                          {application.trackingNumber}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(application.status)} flex items-center gap-1 text-base px-4 py-2`}
                      >
                        {getStatusIcon(application.status)}
                        {application.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted: {formatDateTime(application.submittedAt)}</span>
                    </div>

                    {/* Status Timeline */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Application Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Application Submitted</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDateTime(application.submittedAt)}
                            </p>
                          </div>
                        </div>
                        {application.status !== "pending" && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                application.status === "approved" ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {application.status === "approved" ? "Application Approved" : "Application Rejected"}
                              </p>
                            </div>
                          </div>
                        )}
                        {application.status === "pending" && (
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-1.5"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Under Review</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                Your application is being processed
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Information */}
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                      <User className="w-5 h-5" />
                      Owner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {application.ownerFirstName} {application.ownerLastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{application.ownerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{application.ownerPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {application.ownerAddress}, {application.ownerCity}, PA {application.ownerZipCode}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dog Information */}
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                      <Dog className="w-5 h-5" />
                      Dog Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{application.dogName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Breed</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{application.dogBreed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Color</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">{application.dogColor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                          {application.dogGender}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {application.dogAge} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {application.dogWeight} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Spayed/Neutered</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                          {application.isSpayedNeutered}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vaccination Information */}
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                      <Syringe className="w-5 h-5" />
                      Vaccination & Veterinarian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Rabies Vaccination Date</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {formatDate(application.rabiesVaccinationDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vaccination Expiry</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {formatDate(application.rabiesVaccinationExpiry)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Veterinarian Name</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {application.veterinarianName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Veterinarian Address</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {application.veterinarianAddress}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* License & Payment Information */}
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                      <DollarSign className="w-5 h-5" />
                      License & Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">License Period</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                          {application.licensePeriod.replace("-", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">License Fee</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">${application.licenseFee}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Application Not Found</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We couldn't find an application with tracking number "{trackingNumber}".
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 max-w-md mx-auto">
                      <p className="font-medium">Please check:</p>
                      <ul className="list-disc list-inside space-y-1 text-left">
                        <li>The tracking number is entered correctly</li>
                        <li>The application was submitted on this device and browser</li>
                        <li>Your browser's local storage hasn't been cleared</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        {!isSearched && (
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>• Tracking numbers are generated automatically when you submit your application</p>
              <p>• Your tracking number follows the format: DOG-[timestamp]-[number]</p>
              <p>• Applications are stored locally on your device and browser</p>
              <p>• Make sure you're using the same browser where you submitted your application</p>
              <p>• Contact support if you need assistance with your application</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
