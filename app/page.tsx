"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, Search, CheckCircle, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Pennsylvania Dog License Portal</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Quick and easy dog licensing for Pennsylvania residents. Apply online and track your application status in
            real-time.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-2xl">
                <Plus className="w-6 h-6 text-blue-600" />
                New Application
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Submit a new dog license application for Pennsylvania state compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/new-application">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Application
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-2xl">
                <Search className="w-6 h-6 text-green-600" />
                Track Application
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                Check the status of your submitted dog license applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/track-application">
                <Button variant="outline" className="w-full border-2 bg-transparent" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Track Your Application
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Process</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simple step-by-step form with validation to ensure accuracy
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">PA Compliant</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Meets all Pennsylvania state requirements for dog licensing
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Track Status</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your application status with unique tracking number
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
