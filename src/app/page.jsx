"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
    board: "",
    gradeType: "percentage",
    grade: "",
    interest: "",
    location: "",
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [visibleCareers, setVisibleCareers] = useState(8);
  const [visibleCourses, setVisibleCourses] = useState(5);
  const [loadingState, setLoadingState] = useState("initial");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [careerView, setCareerView] = useState("traditional");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    salary: "all",
    growth: "all",
    location: "all",
    industry: "all",
  });

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      try {
        const parsed = JSON.parse(message);
        setSuggestions(parsed);
        setShowFeedback(true);
        setStreamingMessage("");
        setVisibleCareers(8);
        setVisibleCourses(5);
        setLoadingState("complete");
        setError(null);
      } catch (e) {
        setError("Failed to parse response data");
        console.error("Failed to parse response");
      }
    },
  });

  const handleLoadMore = async (type) => {
    try {
      setLoadingMore(true);
      setLoadingState(`loading_${type}`);

      if (type === "careers") {
        setVisibleCareers((prev) => prev + 15);
      } else if (type === "courses") {
        setVisibleCourses((prev) => prev + 15);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingMore(false);
      setLoadingState("complete");
      setError(null);
    } catch (err) {
      setError(`Failed to load more ${type}`);
      setLoadingMore(false);
      setLoadingState("complete");
    }
  };

  const filterCareers = (careers) => {
    if (!careers) return [];
    return careers.filter((career) => {
      if (selectedCategory !== "all" && career.category !== selectedCategory)
        return false;
      if (
        selectedSpecialization !== "all" &&
        career.specialization !== selectedSpecialization
      )
        return false;
      if (
        filters.salary !== "all" &&
        parseInt(career.startingSalary) < parseInt(filters.salary)
      )
        return false;
      if (filters.growth !== "all" && career.growth < filters.growth)
        return false;
      if (
        filters.location !== "all" &&
        !career.jobLocations.includes(filters.location)
      )
        return false;
      if (filters.industry !== "all" && career.industry !== filters.industry)
        return false;
      return true;
    });
  };

  const groupCareersByType = (careers) => {
    const filtered = filterCareers(careers);
    return {
      traditional: filtered.filter((c) => c.type === "traditional"),
      emerging: filtered.filter((c) => c.type === "emerging"),
      crossIndustry: filtered.filter((c) => c.type === "cross-industry"),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingState("analyzing");
    setError(null);

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Based on the following information for an Indian student, provide career and course suggestions with detailed requirements and salary information:
          Name: ${formData.name}
          Age: ${formData.age}
          Education: ${formData.education}
          Board/University: ${formData.board}
          ${formData.gradeType === "percentage" ? "Percentage" : "CGPA"}: ${
                formData.grade
              }
          Interest: ${formData.interest}
          Preferred Location: ${formData.location}

          Please consider the following grade requirements:
          - Top Universities: 85-90%+ or 8.5+ CGPA
          - Private Universities: 70-85% or 7.0-8.5 CGPA
          - Other Institutions: 60-70% or 6.0-7.0 CGPA

          Include:
          - Traditional career paths
          - Emerging career opportunities
          - Cross-industry applications
          - Future trends and growth potential
          - Related and alternative career paths
          - Industry-specific opportunities
          - Skill transferability analysis`,
            },
          ],
          json_schema: {
            name: "career_suggestions",
            schema: {
              type: "object",
              properties: {
                courses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      duration: { type: "string" },
                      eligibility: { type: "string" },
                      category: { type: "string" },
                      specialization: { type: "string" },
                      type: { type: "string" },
                      relatedCareers: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                    required: [
                      "title",
                      "description",
                      "duration",
                      "eligibility",
                      "category",
                      "specialization",
                      "type",
                      "relatedCareers",
                    ],
                    additionalProperties: false,
                  },
                },
                careers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      type: { type: "string" },
                      category: { type: "string" },
                      specialization: { type: "string" },
                      industry: { type: "string" },
                      educationRequired: { type: "string" },
                      gradeRequirements: {
                        type: "object",
                        properties: {
                          topUniversities: { type: "string" },
                          privateUniversities: { type: "string" },
                          otherInstitutions: { type: "string" },
                        },
                        required: [
                          "topUniversities",
                          "privateUniversities",
                          "otherInstitutions",
                        ],
                        additionalProperties: false,
                      },
                      startingSalary: { type: "string" },
                      salaryGrowth: { type: "string" },
                      growth: { type: "number" },
                      requiredSkills: {
                        type: "array",
                        items: { type: "string" },
                      },
                      transferableSkills: {
                        type: "array",
                        items: { type: "string" },
                      },
                      jobLocations: {
                        type: "array",
                        items: { type: "string" },
                      },
                      careerPath: {
                        type: "array",
                        items: { type: "string" },
                      },
                      alternativeRoles: {
                        type: "array",
                        items: { type: "string" },
                      },
                      relatedCareers: {
                        type: "array",
                        items: { type: "string" },
                      },
                      futureProspects: { type: "string" },
                      industryTrends: { type: "string" },
                    },
                    required: [
                      "title",
                      "description",
                      "type",
                      "category",
                      "specialization",
                      "industry",
                      "educationRequired",
                      "gradeRequirements",
                      "startingSalary",
                      "salaryGrowth",
                      "growth",
                      "requiredSkills",
                      "transferableSkills",
                      "jobLocations",
                      "careerPath",
                      "alternativeRoles",
                      "relatedCareers",
                      "futureProspects",
                      "industryTrends",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["courses", "careers"],
              additionalProperties: false,
            },
          },
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      handleStreamResponse(response);
    } catch (err) {
      setError(err.message);
      setLoadingState("complete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1026] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50 animate-twinkle"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1026] via-[#2A1B3D] to-[#0B1026] opacity-80"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0B1026]/40 backdrop-blur-lg border border-[#FF61D8]/20 shadow-[0_0_15px_rgba(255,97,216,0.3)] rounded-2xl p-8 space-y-8">
          <div className="text-center space-y-4 mb-12 animate-float">
            <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8FF] font-poppins tracking-tight bg-gradient-to-r from-[#FF61D8] via-[#26FFB1] to-[#FF61D8] bg-clip-text text-transparent">
              Career Path Advisor
            </h1>
            <p className="text-lg text-[#E2E8FF]/80 font-inter max-w-2xl mx-auto">
              Discover your ideal career path with AI-powered guidance tailored
              to your academic profile and interests
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-[#FF61D8] to-[#26FFB1] mx-auto rounded-full animate-glow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Education Level
                </label>
                <select
                  name="education"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="10th Standard">10th Standard</option>
                  <option value="12th Standard">12th Standard</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's">
                    Bachelor's (B.Tech/BE/BSc/BA/BCom)
                  </option>
                  <option value="Master's">
                    Master's (M.Tech/ME/MSc/MA/MCom)
                  </option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Board/University Type
                </label>
                <select
                  name="board"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={formData.board}
                  onChange={(e) =>
                    setFormData({ ...formData, board: e.target.value })
                  }
                  required
                >
                  <option value="">Select Board/University Type</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Grade Type
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gradeType"
                      value="percentage"
                      checked={formData.gradeType === "percentage"}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeType: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Percentage</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gradeType"
                      value="cgpa"
                      checked={formData.gradeType === "cgpa"}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeType: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>CGPA</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.gradeType === "percentage"
                      ? "Percentage"
                      : "CGPA"}
                  </label>
                  <input
                    type="number"
                    name="grade"
                    placeholder={
                      formData.gradeType === "percentage"
                        ? "Enter your percentage"
                        : "Enter your CGPA"
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    required
                    min={formData.gradeType === "percentage" ? "0" : "0"}
                    max={formData.gradeType === "percentage" ? "100" : "10"}
                    step={formData.gradeType === "percentage" ? "0.01" : "0.1"}
                  />
                </div>
              </div>
              <select
                name="interest"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                value={formData.interest}
                onChange={(e) =>
                  setFormData({ ...formData, interest: e.target.value })
                }
                required
              >
                <option value="">Select Area of Interest</option>
                <optgroup label="Technology & Computing">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                  <option value="Data Science & Analytics">
                    Data Science & Analytics
                  </option>
                  <option value="Artificial Intelligence & ML">
                    Artificial Intelligence & ML
                  </option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>
                  <option value="Gaming Development">Gaming Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </optgroup>
                <optgroup label="Engineering">
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electronics Engineering">
                    Electronics Engineering
                  </option>
                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>
                  <option value="Aerospace Engineering">
                    Aerospace Engineering
                  </option>
                  <option value="Chemical Engineering">
                    Chemical Engineering
                  </option>
                  <option value="Robotics Engineering">
                    Robotics Engineering
                  </option>
                  <option value="Automotive Engineering">
                    Automotive Engineering
                  </option>
                  <option value="Marine Engineering">Marine Engineering</option>
                  <option value="Industrial Engineering">
                    Industrial Engineering
                  </option>
                </optgroup>
                <optgroup label="Medical & Healthcare">
                  <option value="Medicine (MBBS)">Medicine (MBBS)</option>
                  <option value="Dentistry">Dentistry</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Physiotherapy">Physiotherapy</option>
                  <option value="Veterinary Science">Veterinary Science</option>
                  <option value="Healthcare Management">
                    Healthcare Management
                  </option>
                  <option value="Medical Research">Medical Research</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Mental Health">Mental Health</option>
                </optgroup>
                <optgroup label="Law & Public Services">
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Civil Law">Civil Law</option>
                  <option value="International Law">International Law</option>
                  <option value="Patent Law">Patent Law</option>
                  <option value="Civil Services (IAS/IPS)">
                    Civil Services (IAS/IPS)
                  </option>
                  <option value="Public Administration">
                    Public Administration
                  </option>
                  <option value="Social Work">Social Work</option>
                  <option value="Political Science">Political Science</option>
                  <option value="Environmental Law">Environmental Law</option>
                </optgroup>
                <optgroup label="Business & Finance">
                  <option value="Chartered Accountancy">
                    Chartered Accountancy
                  </option>
                  <option value="Business Administration">
                    Business Administration
                  </option>
                  <option value="Investment Banking">Investment Banking</option>
                  <option value="Financial Analysis">Financial Analysis</option>
                  <option value="Marketing Management">
                    Marketing Management
                  </option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="International Business">
                    International Business
                  </option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Risk Management">Risk Management</option>
                  <option value="Economics">Economics</option>
                </optgroup>
                <optgroup label="Arts & Design">
                  <option value="Fashion Design">Fashion Design</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Animation">Animation</option>
                  <option value="Fine Arts">Fine Arts</option>
                  <option value="Photography">Photography</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Industrial Design">Industrial Design</option>
                  <option value="Visual Communications">
                    Visual Communications
                  </option>
                </optgroup>
                <optgroup label="Media & Communications">
                  <option value="Journalism">Journalism</option>
                  <option value="Mass Communication">Mass Communication</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Film Making">Film Making</option>
                  <option value="Broadcasting">Broadcasting</option>
                  <option value="Advertising">Advertising</option>
                  <option value="Corporate Communications">
                    Corporate Communications
                  </option>
                  <option value="Technical Writing">Technical Writing</option>
                </optgroup>
                <optgroup label="Science & Research">
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Environmental Science">
                    Environmental Science
                  </option>
                  <option value="Astronomy">Astronomy</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Geology">Geology</option>
                  <option value="Agricultural Science">
                    Agricultural Science
                  </option>
                  <option value="Marine Biology">Marine Biology</option>
                </optgroup>
                <optgroup label="Education & Training">
                  <option value="Teaching">Teaching</option>
                  <option value="Special Education">Special Education</option>
                  <option value="Educational Administration">
                    Educational Administration
                  </option>
                  <option value="Career Counseling">Career Counseling</option>
                  <option value="Corporate Training">Corporate Training</option>
                  <option value="Early Childhood Education">
                    Early Childhood Education
                  </option>
                  <option value="Language Teaching">Language Teaching</option>
                  <option value="Educational Psychology">
                    Educational Psychology
                  </option>
                  <option value="Sports Coaching">Sports Coaching</option>
                  <option value="E-learning Development">
                    E-learning Development
                  </option>
                </optgroup>
                <optgroup label="Hospitality & Tourism">
                  <option value="Hotel Management">Hotel Management</option>
                  <option value="Tourism Management">Tourism Management</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Restaurant Management">
                    Restaurant Management
                  </option>
                  <option value="Airline & Airport Management">
                    Airline & Airport Management
                  </option>
                  <option value="Cruise Ship Management">
                    Cruise Ship Management
                  </option>
                  <option value="Travel & Tourism">Travel & Tourism</option>
                  <option value="Culinary Arts">Culinary Arts</option>
                  <option value="Spa Management">Spa Management</option>
                  <option value="Resort Management">Resort Management</option>
                </optgroup>
              </select>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF61D8] to-[#26FFB1] text-[#E2E8FF] py-3 px-6 rounded-lg font-semibold hover:from-[#FF61D8]/90 hover:to-[#26FFB1]/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 animate-pulse"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span>Analyzing your profile...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    <span>Get Career Suggestions</span>
                  </>
                )}
              </button>
            </form>

            <div className="hidden md:block">
              <img
                src="/career-guidance.svg"
                alt="Career Guidance Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>

          {streamingMessage && (
            <div className="mt-8 p-6 bg-[#2A1B3D]/50 border border-[#FF61D8]/20 rounded-xl backdrop-blur-sm animate-fade-in">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-[#FF61D8]/20 animate-cosmic-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-[#26FFB1]/20 animate-cosmic-spin-reverse"></div>
                  <div className="absolute inset-4 rounded-full border-4 border-[#E2E8FF]/20 animate-cosmic-pulse"></div>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#FF61D8] rounded-full animate-cosmic-glow"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[#E2E8FF] font-medium text-lg">
                    {loadingState === "analyzing" &&
                      "Analyzing your profile..."}
                    {loadingState === "loading_careers" &&
                      "Loading more career options..."}
                    {loadingState === "loading_courses" &&
                      "Finding matching courses..."}
                    {loadingState === "initial" && "Exploring possibilities..."}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="w-2 h-2 bg-[#FF61D8] rounded-full animate-cosmic-twinkle"></span>
                    <span className="w-2 h-2 bg-[#26FFB1] rounded-full animate-cosmic-twinkle-delay"></span>
                    <span className="w-2 h-2 bg-[#E2E8FF] rounded-full animate-cosmic-twinkle-delay-2"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {suggestions && (
            <div className="mt-6 space-y-6">
              {/* Career Sections */}
              <div className="space-y-8">
                {suggestions &&
                  Object.entries(groupCareersByType(suggestions.careers)).map(
                    ([type, careers]) =>
                      careers.length > 0 && (
                        <div
                          key={type}
                          className="bg-[#1A1B3D]/30 backdrop-blur-lg border border-[#FF61D8]/20 rounded-xl p-6"
                        >
                          <h2 className="text-2xl font-bold mb-4 text-[#E2E8FF] capitalize">
                            {type === "traditional"
                              ? "Traditional Careers"
                              : type === "emerging"
                              ? "Emerging Opportunities"
                              : "Cross-Industry Paths"}
                          </h2>
                          <div className="space-y-4">
                            {careers
                              .slice(0, visibleCareers)
                              .map((career, index) => (
                                <div
                                  key={index}
                                  className="bg-[#2A1B3D]/50 border border-[#FF61D8]/10 rounded-lg p-6"
                                >
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-[#E2E8FF]">
                                      {career.title}
                                    </h3>
                                    <span className="text-[#26FFB1] text-sm">
                                      {career.type === "emerging"
                                        ? "🚀 Emerging"
                                        : career.type === "traditional"
                                        ? "🏛️ Traditional"
                                        : "🔄 Cross-Industry"}
                                    </span>
                                  </div>
                                  <div className="mt-4 space-y-4">
                                    <p className="text-[#E2E8FF]/80">
                                      {career.description}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="text-[#FF61D8] font-semibold mb-2">
                                            Required Skills
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {career.requiredSkills.map(
                                              (skill, idx) => (
                                                <span
                                                  key={idx}
                                                  className="bg-[#FF61D8]/10 text-[#FF61D8] px-3 py-1 rounded-full text-sm"
                                                >
                                                  {skill}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-[#26FFB1] font-semibold mb-2">
                                            Growth & Salary
                                          </h4>
                                          <div className="space-y-2 text-[#E2E8FF]/80">
                                            <p>
                                              Starting: {career.startingSalary}
                                            </p>
                                            <p>Growth: {career.salaryGrowth}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="text-[#FF61D8] font-semibold mb-2">
                                            Career Path
                                          </h4>
                                          <div className="space-y-2 text-[#E2E8FF]/80">
                                            {career.careerPath.map(
                                              (step, idx) => (
                                                <div
                                                  key={idx}
                                                  className="flex items-center"
                                                >
                                                  <span className="text-[#26FFB1] mr-2">
                                                    →
                                                  </span>
                                                  {step}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="text-[#26FFB1] font-semibold mb-2">
                                            Industry Applications
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {career.jobLocations.map(
                                              (location, idx) => (
                                                <span
                                                  key={idx}
                                                  className="bg-[#26FFB1]/10 text-[#26FFB1] px-3 py-1 rounded-full text-sm"
                                                >
                                                  {location}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-4 border-t border-[#FF61D8]/10">
                                      <h4 className="text-[#E2E8FF] font-semibold mb-3">
                                        Related Careers
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {career.relatedCareers.map(
                                          (related, idx) => (
                                            <span
                                              key={idx}
                                              className="bg-[#1A1B3D] text-[#E2E8FF]/80 px-3 py-1 rounded-full text-sm"
                                            >
                                              {related}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                          {careers.length > visibleCareers && (
                            <button
                              onClick={() => handleLoadMore("careers")}
                              className="mt-6 w-full bg-gradient-to-r from-[#FF61D8] to-[#26FFB1] text-[#E2E8FF] py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#FF61D8]/20 flex items-center justify-center space-x-3"
                            >
                              <span className="text-lg">
                                Show More{" "}
                                {type === "traditional"
                                  ? "Traditional"
                                  : type === "emerging"
                                  ? "Emerging"
                                  : "Cross-Industry"}{" "}
                                Careers
                              </span>
                              <span className="text-sm opacity-80">
                                ({careers.length - visibleCareers} remaining)
                              </span>
                            </button>
                          )}
                        </div>
                      )
                  )}
              </div>

              {/* Course Section */}
              {suggestions.courses && suggestions.courses.length > 0 && (
                <div className="bg-[#1A1B3D]/30 backdrop-blur-lg border border-[#FF61D8]/20 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-4 text-[#E2E8FF]">
                    Recommended Courses
                  </h2>
                  <div className="space-y-4">
                    {suggestions.courses
                      .slice(0, visibleCourses)
                      .map((course, index) => (
                        <div
                          key={index}
                          className="bg-[#2A1B3D]/50 border border-[#FF61D8]/10 rounded-lg p-6"
                        >
                          <h3 className="text-xl font-bold text-[#E2E8FF] mb-2">
                            {course.title}
                          </h3>
                          <p className="text-[#E2E8FF]/80 mb-4">
                            {course.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-[#FF61D8] font-semibold mb-2">
                                Course Details
                              </h4>
                              <div className="space-y-2 text-[#E2E8FF]/80">
                                <p>Duration: {course.duration}</p>
                                <p>Category: {course.category}</p>
                                <p>Specialization: {course.specialization}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-[#26FFB1] font-semibold mb-2">
                                Eligibility
                              </h4>
                              <p className="text-[#E2E8FF]/80">
                                {course.eligibility}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {suggestions.courses.length > visibleCourses && (
                    <button
                      onClick={() => handleLoadMore("courses")}
                      className="mt-6 w-full bg-gradient-to-r from-[#FF61D8] to-[#26FFB1] text-[#E2E8FF] py-4 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#FF61D8]/20 flex items-center justify-center space-x-3"
                    >
                      <span className="text-lg">Show More Courses</span>
                      <span className="text-sm opacity-80">
                        ({suggestions.courses.length - visibleCourses}{" "}
                        remaining)
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-bold mb-2">Was this helpful?</h3>
            <div className="space-x-2">
              <button
                onClick={() => setFeedback("yes")}
                className={`px-4 py-2 rounded-md ${
                  feedback === "yes" ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setFeedback("no")}
                className={`px-4 py-2 rounded-md ${
                  feedback === "no" ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            <p>
              Note: Information provided is based on data available up to 2025
              and reflects current Indian job market trends.
            </p>
            <p className="mt-2">Grade requirements may vary by institution:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Top Universities typically require 85-90%+ or 8.5+ CGPA</li>
              <li>
                Private Universities typically require 70-85% or 7.0-8.5 CGPA
              </li>
              <li>
                Other Institutions typically require 60-70% or 6.0-7.0 CGPA
              </li>
            </ul>
            <p className="mt-2">
              Salary ranges and job prospects may vary based on location,
              experience, and market conditions.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#FF61D8] to-[#26FFB1] text-[#E2E8FF] p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-glow"
        aria-label="Scroll to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      <style jsx global>{`
        @keyframes cosmic-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes cosmic-spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes cosmic-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes cosmic-glow {
          0%, 100% { box-shadow: 0 0 20px #FF61D8; }
          50% { box-shadow: 0 0 40px #FF61D8; }
        }

        @keyframes cosmic-twinkle {
          0%, 100% { transform: scale(0.3); opacity: 0.3; }
          50% { transform: scale(1); opacity: 1; }
        }

        @keyframes cosmic-twinkle-delay {
          0%, 100% { transform: scale(0.3); opacity: 0.3; }
          50% { transform: scale(1); opacity: 1; }
        }

        @keyframes cosmic-twinkle-delay-2 {
          0%, 100% { transform: scale(0.3); opacity: 0.3; }
          50% { transform: scale(1); opacity: 1; }
        }

        .animate-cosmic-spin {
          animation: cosmic-spin 4s linear infinite;
        }

        .animate-cosmic-spin-reverse {
          animation: cosmic-spin-reverse 4s linear infinite;
        }

        .animate-cosmic-pulse {
          animation: cosmic-pulse 2s ease-in-out infinite;
        }

        .animate-cosmic-glow {
          animation: cosmic-glow 2s ease-in-out infinite;
        }

        .animate-cosmic-twinkle {
          animation: cosmic-twinkle 1.5s ease-in-out infinite;
        }

        .animate-cosmic-twinkle-delay {
          animation: cosmic-twinkle-delay 1.5s ease-in-out infinite 0.5s;
        }

        .animate-cosmic-twinkle-delay-2 {
          animation: cosmic-twinkle-delay-2 1.5s ease-in-out infinite 1s;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255,97,216,0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255,97,216,0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,97,216,0.5);
        }
      `}</style>
    </div>
  );
}

export default MainComponent;