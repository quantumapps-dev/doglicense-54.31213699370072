"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  ownerFirstName: z.string().min(2, "First name must be at least 2 characters"),
  ownerLastName: z.string().min(2, "Last name must be at least 2 characters"),
  ownerAddress: z.string().min(1, "Address is required"),
  ownerCity: z.string().min(1, "City is required"),
  ownerZipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  ownerPhone: z
    .string()
    .regex(/^[\d\s()+-]+$/, "Invalid phone format")
    .min(10, "Phone number is required"),
  ownerEmail: z.string().email("Invalid email format"),
  dogName: z.string().min(1, "Dog name is required"),
  dogBreed: z.string().min(1, "Breed is required"),
  dogColor: z.string().min(1, "Color is required"),
  dogGender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  dogAge: z.coerce.number().positive("Age must be a positive number"),
  dogWeight: z.coerce.number().positive("Weight must be a positive number"),
  isSpayedNeutered: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please select yes or no" }),
  }),
  rabiesVaccinationDate: z.string().min(1, "Vaccination date is required"),
  rabiesVaccinationExpiry: z.string().min(1, "Expiry date is required"),
  veterinarianName: z.string().min(1, "Veterinarian name is required"),
  veterinarianAddress: z.string().min(1, "Veterinarian address is required"),
  licensePeriod: z.enum(["1-year", "2-year", "3-year"], {
    errorMap: () => ({ message: "Please select a license period" }),
  }),
})

type FormData = z.infer<typeof formSchema>

const STEPS = [
  { title: "Owner Information", description: "Your contact details" },
  { title: "Dog Information", description: "Details about your dog" },
  { title: "Vaccination & Vet", description: "Health and veterinary info" },
  { title: "License & Payment", description: "License period and payment" },
]

export default function NewApplication() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const dogGender = watch("dogGender")
  const isSpayedNeutered = watch("isSpayedNeutered")
  const licensePeriod = watch("licensePeriod")

  const generateTrackingNumber = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `DOG-${timestamp}-${random}`
  }

  const calculateFee = (period: string) => {
    switch (period) {
      case "1-year":
        return 25
      case "2-year":
        return 45
      case "3-year":
        return 60
      default:
        return 0
    }
  }

  const licenseFee = licensePeriod ? calculateFee(licensePeriod) : 0

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof FormData)[] = []

    switch (step) {
      case 0:
        fieldsToValidate = [
          "ownerFirstName",
          "ownerLastName",
          "ownerAddress",
          "ownerCity",
          "ownerZipCode",
          "ownerPhone",
          "ownerEmail",
        ]
        break
      case 1:
        fieldsToValidate = ["dogName", "dogBreed", "dogColor", "dogGender", "dogAge", "dogWeight", "isSpayedNeutered"]
        break
      case 2:
        fieldsToValidate = [
          "rabiesVaccinationDate",
          "rabiesVaccinationExpiry",
          "veterinarianName",
          "veterinarianAddress",
        ]
        break
      case 3:
        fieldsToValidate = ["licensePeriod"]
        break
    }

    const result = await trigger(fieldsToValidate)
    return result
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (!isValid) {
      toast.error("Please fill in all required fields correctly")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: FormData) => {
    if (!isClient) {
      toast.error("Application not ready. Please try again.")
      return
    }

    // Validate rabies vaccination is current
    const expiryDate = new Date(data.rabiesVaccinationExpiry)
    const today = new Date()

    if (expiryDate < today) {
      toast.error("Rabies vaccination has expired. Please update vaccination before applying.")
      return
    }

    const trackingNumber = generateTrackingNumber()

    const application = {
      trackingNumber,
      ...data,
      status: "pending",
      submittedAt: new Date().toISOString(),
      licenseFee,
    }

    try {
      // Save to localStorage
      const existingApplications = localStorage.getItem("dogLicenseApplications")
      const applications = existingApplications ? JSON.parse(existingApplications) : []
      applications.push(application)
      localStorage.setItem("dogLicenseApplications", JSON.stringify(applications))

      toast.success(`Application submitted! Tracking number: ${trackingNumber}`)

      // Redirect to track application page after 2 seconds
      setTimeout(() => {
        router.push(`/track-application?id=${trackingNumber}`)
      }, 2000)
    } catch (error) {
      console.error("[v0] Error saving application:", error)
      toast.error("Failed to save application. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dog License Application</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Pennsylvania State Compliance</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-colors",
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                  )}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-1 w-full absolute top-5 -z-10",
                      index < currentStep ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700",
                    )}
                    style={{ left: "50%", width: "100%" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">{STEPS[currentStep].title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {STEPS[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 0: Owner Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerFirstName">First Name *</Label>
                      <Input id="ownerFirstName" {...register("ownerFirstName")} className="mt-1" />
                      {errors.ownerFirstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.ownerFirstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ownerLastName">Last Name *</Label>
                      <Input id="ownerLastName" {...register("ownerLastName")} className="mt-1" />
                      {errors.ownerLastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.ownerLastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ownerAddress">Street Address *</Label>
                    <Input id="ownerAddress" {...register("ownerAddress")} className="mt-1" />
                    {errors.ownerAddress && <p className="text-red-500 text-sm mt-1">{errors.ownerAddress.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerCity">City *</Label>
                      <Input id="ownerCity" {...register("ownerCity")} className="mt-1" />
                      {errors.ownerCity && <p className="text-red-500 text-sm mt-1">{errors.ownerCity.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="ownerZipCode">ZIP Code *</Label>
                      <Input id="ownerZipCode" {...register("ownerZipCode")} placeholder="12345" className="mt-1" />
                      {errors.ownerZipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.ownerZipCode.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ownerPhone">Phone Number *</Label>
                    <Input
                      id="ownerPhone"
                      type="tel"
                      {...register("ownerPhone")}
                      placeholder="(123) 456-7890"
                      className="mt-1"
                    />
                    {errors.ownerPhone && <p className="text-red-500 text-sm mt-1">{errors.ownerPhone.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ownerEmail">Email Address *</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      {...register("ownerEmail")}
                      placeholder="you@example.com"
                      className="mt-1"
                    />
                    {errors.ownerEmail && <p className="text-red-500 text-sm mt-1">{errors.ownerEmail.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 1: Dog Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dogName">Dog's Name *</Label>
                    <Input id="dogName" {...register("dogName")} className="mt-1" />
                    {errors.dogName && <p className="text-red-500 text-sm mt-1">{errors.dogName.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dogBreed">Breed *</Label>
                      <Input id="dogBreed" {...register("dogBreed")} className="mt-1" />
                      {errors.dogBreed && <p className="text-red-500 text-sm mt-1">{errors.dogBreed.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="dogColor">Primary Color *</Label>
                      <Input id="dogColor" {...register("dogColor")} className="mt-1" />
                      {errors.dogColor && <p className="text-red-500 text-sm mt-1">{errors.dogColor.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <RadioGroup
                      value={dogGender}
                      onValueChange={(value) => setValue("dogGender", value as "male" | "female")}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">
                          Female
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.dogGender && <p className="text-red-500 text-sm mt-1">{errors.dogGender.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dogAge">Age (years) *</Label>
                      <Input id="dogAge" type="number" {...register("dogAge")} className="mt-1" />
                      {errors.dogAge && <p className="text-red-500 text-sm mt-1">{errors.dogAge.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="dogWeight">Weight (lbs) *</Label>
                      <Input id="dogWeight" type="number" {...register("dogWeight")} className="mt-1" />
                      {errors.dogWeight && <p className="text-red-500 text-sm mt-1">{errors.dogWeight.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Is the dog spayed/neutered? *</Label>
                    <RadioGroup
                      value={isSpayedNeutered}
                      onValueChange={(value) => setValue("isSpayedNeutered", value as "yes" | "no")}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="spayed-yes" />
                        <Label htmlFor="spayed-yes" className="font-normal cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="spayed-no" />
                        <Label htmlFor="spayed-no" className="font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.isSpayedNeutered && (
                      <p className="text-red-500 text-sm mt-1">{errors.isSpayedNeutered.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Vaccination & Vet */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      <strong>PA State Requirement:</strong> All dogs must have a current rabies vaccination to obtain a
                      license.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rabiesVaccinationDate">Rabies Vaccination Date *</Label>
                      <Input
                        id="rabiesVaccinationDate"
                        type="date"
                        {...register("rabiesVaccinationDate")}
                        className="mt-1"
                      />
                      {errors.rabiesVaccinationDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.rabiesVaccinationDate.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="rabiesVaccinationExpiry">Vaccination Expiry Date *</Label>
                      <Input
                        id="rabiesVaccinationExpiry"
                        type="date"
                        {...register("rabiesVaccinationExpiry")}
                        className="mt-1"
                      />
                      {errors.rabiesVaccinationExpiry && (
                        <p className="text-red-500 text-sm mt-1">{errors.rabiesVaccinationExpiry.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="veterinarianName">Veterinarian's Name *</Label>
                    <Input id="veterinarianName" {...register("veterinarianName")} className="mt-1" />
                    {errors.veterinarianName && (
                      <p className="text-red-500 text-sm mt-1">{errors.veterinarianName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="veterinarianAddress">Veterinarian's Address *</Label>
                    <Input id="veterinarianAddress" {...register("veterinarianAddress")} className="mt-1" />
                    {errors.veterinarianAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.veterinarianAddress.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: License & Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="licensePeriod">License Period *</Label>
                    <Select
                      value={licensePeriod}
                      onValueChange={(value) => setValue("licensePeriod", value as "1-year" | "2-year" | "3-year")}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select license period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year - $25</SelectItem>
                        <SelectItem value="2-year">2 Years - $45</SelectItem>
                        <SelectItem value="3-year">3 Years - $60</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.licensePeriod && (
                      <p className="text-red-500 text-sm mt-1">{errors.licensePeriod.message}</p>
                    )}
                  </div>

                  {licensePeriod && (
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                          <span>License Period:</span>
                          <span className="font-medium">
                            {licensePeriod === "1-year" && "1 Year"}
                            {licensePeriod === "2-year" && "2 Years"}
                            {licensePeriod === "3-year" && "3 Years"}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-700 dark:text-gray-300">
                          <span>License Fee:</span>
                          <span className="font-medium">${licenseFee}</span>
                        </div>
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                            <span>Total Amount:</span>
                            <span>${licenseFee}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Payment will be processed upon submission. You will receive a tracking number to monitor your
                          application status.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
