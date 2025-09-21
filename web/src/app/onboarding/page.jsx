import { useState } from "react";
import {
  Bot,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Heart,
  DollarSign,
  MapPin,
  Home,
  CheckCircle,
  Loader,
  AlertCircle,
  Star,
  Award,
} from "lucide-react";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    educationLevel: "",
    boardUniversity: "",
    gradePercentage: "",
    gradeType: "percentage",
    areaOfInterest: [],
    budgetMin: "",
    budgetMax: "",
    accommodationType: "",
    preferredLocation: "",
  });

  const totalSteps = 6;

  const educationLevels = [
    { value: "10th", label: "10th Standard" },
    { value: "12th", label: "12th Standard" },
    { value: "diploma", label: "Diploma" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
  ];

  const careerCategories = {
    "Engineering": [
      "Computer Science Engineering (CSE)",
      "Electrical & Electronics Engineering (EEE)",
      "Electronics & Communication Engineering (ECE)",
      "Mechanical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Aerospace Engineering",
      "Biomedical Engineering",
      "Information Technology (IT)",
      "Software Engineering",
      "Data Science & Engineering",
      "Artificial Intelligence & Machine Learning",
      "Cybersecurity Engineering"
    ],
    "Medicine & Healthcare": [
      "MBBS (Medicine)",
      "BDS (Dentistry)", 
      "BAMS (Ayurveda)",
      "BHMS (Homeopathy)",
      "B.Pharm (Pharmacy)",
      "Nursing (B.Sc Nursing)",
      "Physiotherapy (BPT)",
      "Veterinary Science (B.V.Sc)",
      "Medical Laboratory Technology",
      "Radiology & Imaging Technology",
      "Optometry",
      "Psychology (Clinical)",
      "Public Health"
    ],
    "Business & Management": [
      "Business Administration (BBA)",
      "Commerce (B.Com)",
      "Chartered Accountancy (CA)",
      "Company Secretary (CS)",
      "Cost & Management Accountancy (CMA)",
      "Marketing & Sales",
      "Human Resources (HR)",
      "Finance & Banking",
      "International Business",
      "Entrepreneurship",
      "Digital Marketing",
      "Supply Chain Management",
      "Event Management"
    ],
    "Science & Research": [
      "Physics",
      "Chemistry", 
      "Mathematics",
      "Biology/Life Sciences",
      "Biotechnology",
      "Microbiology",
      "Environmental Science",
      "Forensic Science",
      "Marine Biology",
      "Astronomy & Astrophysics",
      "Geology",
      "Statistics",
      "Research & Development"
    ],
    "Design & Creative": [
      "Graphic Design",
      "UI/UX Design",
      "Fashion Design",
      "Interior Design",
      "Product Design",
      "Animation & VFX",
      "Game Design",
      "Photography",
      "Video Editing",
      "Architecture",
      "Textile Design",
      "Jewelry Design",
      "Industrial Design"
    ],
    "Law & Legal Studies": [
      "LLB (Bachelor of Laws)",
      "Corporate Law",
      "Criminal Law",
      "Constitutional Law",
      "International Law",
      "Cyber Law",
      "Intellectual Property Law",
      "Environmental Law",
      "Human Rights Law",
      "Legal Journalism"
    ]
  };

  const accommodationTypes = [
    { value: "hostel", label: "College Hostel" },
    { value: "pg", label: "Paying Guest" },
    { value: "home", label: "Stay at Home" },
    { value: "any", label: "Any Option" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Clear previous specializations from this category
    const newSpecializations = selectedSpecializations.filter(spec => 
      !careerCategories[category]?.includes(spec)
    );
    setSelectedSpecializations(newSpecializations);
    handleInputChange("areaOfInterest", newSpecializations);
  };

  const handleSpecializationToggle = (specialization) => {
    const newSpecializations = selectedSpecializations.includes(specialization)
      ? selectedSpecializations.filter(item => item !== specialization)
      : [...selectedSpecializations, specialization];
    
    setSelectedSpecializations(newSpecializations);
    handleInputChange("areaOfInterest", newSpecializations);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      const userData = await response.json();
      setSuccess(true);

      setTimeout(async () => {
        try {
          await fetch("/api/recommendations/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userData.id }),
          });
          window.location.href = "/";
        } catch (error) {
          console.error("Error generating recommendations:", error);
          setError(
            "Profile created but failed to generate recommendations. You can continue to the dashboard.",
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(
        "Failed to create your profile. Please check your information and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Personal Information
              </h2>
              <p className="text-gray-600 text-lg">
                Let's start with basic details about you
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your age"
                  min="15"
                  max="50"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Education Details
              </h2>
              <p className="text-gray-600 text-lg">
                Tell us about your educational background
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Current Education Level
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    handleInputChange("educationLevel", e.target.value)
                  }
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                >
                  <option value="">Select your education level</option>
                  {educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Board/University
                </label>
                <input
                  type="text"
                  value={formData.boardUniversity}
                  onChange={(e) =>
                    handleInputChange("boardUniversity", e.target.value)
                  }
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="e.g., CBSE, ICSE, Mumbai University"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Grade Type
                  </label>
                  <select
                    value={formData.gradeType}
                    onChange={(e) =>
                      handleInputChange("gradeType", e.target.value)
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="cgpa">CGPA</option>
                    <option value="gpa">GPA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Grade/Score
                  </label>
                  <input
                    type="number"
                    value={formData.gradePercentage}
                    onChange={(e) =>
                      handleInputChange("gradePercentage", e.target.value)
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder={
                      formData.gradeType === "percentage" ? "85" : "8.5"
                    }
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Career Interests
              </h2>
              <p className="text-gray-600 text-lg">
                First select a career category, then choose specific specializations
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Star className="w-4 h-4" />
                <span>{selectedSpecializations.length} specializations selected</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Career Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                >
                  <option value="">Choose a career category</option>
                  {Object.keys(careerCategories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specializations Grid */}
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Select Specializations in {selectedCategory}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
                    {careerCategories[selectedCategory]?.map((specialization) => (
                      <button
                        key={specialization}
                        onClick={() => handleSpecializationToggle(specialization)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium text-left ${
                          selectedSpecializations.includes(specialization)
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-white text-gray-700 bg-white"
                        }`}
                      >
                        {specialization}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Specializations Summary */}
              {selectedSpecializations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-2">
                    <Award className="w-4 h-4" />
                    <span>Your Selected Specializations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecializations.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        {spec}
                        <button
                          onClick={() => handleSpecializationToggle(spec)}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!selectedCategory && (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Please select a career category to see available specializations</p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Budget Range
              </h2>
              <p className="text-gray-600 text-lg">
                What's your budget for education per year?
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Minimum Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) =>
                      handleInputChange("budgetMin", e.target.value)
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="50,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Maximum Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) =>
                      handleInputChange("budgetMax", e.target.value)
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="5,00,000"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                  <Award className="w-4 h-4" />
                  <span>Budget Tip</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  Consider all costs including tuition, accommodation, and
                  living expenses when setting your budget.
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Home className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Accommodation & Location
              </h2>
              <p className="text-gray-600 text-lg">
                Your preferences for staying and location
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Accommodation Preference
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accommodationTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        handleInputChange("accommodationType", type.value)
                      }
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.accommodationType === type.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Preferred Location/City
                </label>
                <input
                  type="text"
                  value={formData.preferredLocation}
                  onChange={(e) =>
                    handleInputChange("preferredLocation", e.target.value)
                  }
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Mumbai, Delhi, Bangalore, or Any"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div
                className={`w-16 h-16 ${success ? "bg-gradient-to-br from-green-500 to-emerald-500" : "bg-gradient-to-br from-gray-500 to-slate-500"} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300`}
              >
                {success ? (
                  <CheckCircle
                    className="w-8 h-8 text-white animate-pulse"
                    strokeWidth={2}
                  />
                ) : (
                  <CheckCircle className="w-8 h-8 text-white" strokeWidth={2} />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {success
                  ? "Profile Created Successfully! 🎉"
                  : "Review Your Profile"}
              </h2>
              <p className="text-gray-600 text-lg">
                {success
                  ? "Generating personalized recommendations for you..."
                  : "Please review your information before we generate your recommendations"}
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 px-6 py-4 rounded-xl">
                  <Loader className="w-5 h-5 text-green-600 animate-spin" />
                  <span className="text-green-700 font-medium">
                    Creating your personalized recommendations...
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="font-semibold text-gray-900 mb-1">
                      Personal Info
                    </div>
                    <div className="text-gray-600">
                      {formData.name}, {formData.age} years old
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl">
                    <div className="font-semibold text-gray-900 mb-1">
                      Education
                    </div>
                    <div className="text-gray-600">
                      {formData.educationLevel} • {formData.gradePercentage}{" "}
                      {formData.gradeType}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl">
                    <div className="font-semibold text-gray-900 mb-1">
                      Interests
                    </div>
                    <div className="text-gray-600">
                      {selectedSpecializations.slice(0, 3).join(", ")}
                      {selectedSpecializations.length > 3
                        ? ` +${selectedSpecializations.length - 3} more`
                        : ""}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl">
                    <div className="font-semibold text-gray-900 mb-1">
                      Budget & Location
                    </div>
                    <div className="text-gray-600">
                      ₹{formData.budgetMin} - ₹{formData.budgetMax} •{" "}
                      {formData.preferredLocation}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.age;
      case 2:
        return formData.educationLevel && formData.gradePercentage;
      case 3:
        return selectedSpecializations.length > 0;
      case 4:
        return formData.budgetMin && formData.budgetMax;
      case 5:
        return formData.accommodationType && formData.preferredLocation;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Career AI Setup
                </h1>
                <p className="text-sm text-gray-500">
                  Build your personalized career profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < currentStep
                        ? "bg-blue-600"
                        : i === currentStep - 1
                          ? "bg-blue-400"
                          : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isStepValid()
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting || success}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isStepValid() && !isSubmitting && !success
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Profile Created!</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}