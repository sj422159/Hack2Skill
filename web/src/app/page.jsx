import { useState, useEffect } from "react";
import {
  Home,
  User,
  Bot,
  FileText,
  Users,
  Settings,
  Clock,
  Award,
  ArrowRight,
  Zap,
  BarChart2,
  BookOpen,
  Building2,
  Briefcase,
  Map,
  MessageCircle,
  PlusCircle,
  Loader,
  AlertCircle,
  Star,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export default function CareerAssistantDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [recommendations, setRecommendations] = useState({
    courses: [],
    universities: [],
    jobs: [],
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navItems = [
    { name: "Dashboard", icon: Home, active: true, color: "bg-blue-600" },
    {
      name: "Profile Setup",
      icon: User,
      active: false,
      color: "bg-purple-600",
    },
    { name: "AI Career Chat", icon: Bot, active: false, color: "bg-green-600" },
    {
      name: "Course Finder",
      icon: BookOpen,
      active: false,
      color: "bg-orange-600",
    },
    {
      name: "University Search",
      icon: Building2,
      active: false,
      color: "bg-red-600",
    },
    {
      name: "Job Explorer",
      icon: Briefcase,
      active: false,
      color: "bg-indigo-600",
    },
    { name: "Career Roadmap", icon: Map, active: false, color: "bg-teal-600" },
    { name: "Chat History", icon: Clock, active: false, color: "bg-gray-600" },
    { name: "Settings", icon: Settings, active: false, color: "bg-slate-600" },
  ];

  const kpiCards = [
    {
      label: "Course Matches",
      value: recommendations.courses.length.toString(),
      delta: "Based on your profile",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "University Options",
      value: recommendations.universities.length.toString(),
      delta: "Matching your criteria",
      icon: Building2,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Career Paths",
      value: recommendations.jobs.length.toString(),
      delta: "Aligned with interests",
      icon: Briefcase,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        if (userData) {
          await loadRecommendations(userData.id);
        }
      } else {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      setError("Failed to load user profile");
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecommendations = async (userId) => {
    try {
      const [coursesRes, universitiesRes, jobsRes] = await Promise.all([
        fetch(`/api/recommendations/courses?userId=${userId}`),
        fetch(`/api/recommendations/universities?userId=${userId}`),
        fetch(`/api/recommendations/jobs?userId=${userId}`),
      ]);

      const courses = coursesRes.ok ? await coursesRes.json() : [];
      const universities = universitiesRes.ok
        ? await universitiesRes.json()
        : [];
      const jobs = jobsRes.ok ? await jobsRes.json() : [];

      setRecommendations({ courses, universities, jobs });
    } catch (error) {
      console.error("Error loading recommendations:", error);
      setError("Failed to load recommendations");
    }
  };

  const handleStartOnboarding = () => {
    window.location.href = "/onboarding";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Loading your career dashboard...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we prepare your personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  if (showOnboarding && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to AI Career Assistant
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Get personalized career guidance based on your education, interests,
            and goals. Let our advanced AI help you discover the perfect
            courses, universities, and career paths tailored just for you.
          </p>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={handleStartOnboarding}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PlusCircle className="w-5 h-5" />
            Start Your Career Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-72 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Career AI
              </span>
              <p className="text-xs text-gray-500">Your AI Career Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const handleNavClick = () => {
                switch (item.name) {
                  case "AI Career Chat":
                    window.location.href = "/chat";
                    break;
                  case "Profile Setup":
                    window.location.href = "/onboarding";
                    break;
                  case "Chat History":
                    window.location.href = "/chat-history";
                    break;
                  case "Course Finder":
                    window.location.href = "/courses";
                    break;
                  case "University Search":
                    window.location.href = "/universities";
                    break;
                  case "Job Explorer":
                    window.location.href = "/jobs";
                    break;
                  default:
                    break;
                }
              };

              return (
                <button
                  key={index}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-sm transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent
                    className="w-5 h-5"
                    strokeWidth={item.active ? 2 : 1.5}
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* AI Assistant Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-green-800">
                  AI Assistant
                </div>
                <div className="text-xs text-green-600">Ready to help you</div>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                  {currentUser?.name
                    ? currentUser.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {currentUser?.name || "User"}
                  </span>
                  <p className="text-xs text-gray-500">
                    {currentUser?.educationLevel || "Student"}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {currentUser?.name?.split(" ")[0] || "Student"}!
                  👋
                </h1>
                <p className="text-gray-600">
                  Here's your personalized career dashboard with AI-powered
                  recommendations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => (window.location.href = "/chat")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Bot className="w-5 h-5" />
                  Ask AI Advisor
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kpiCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${card.iconColor}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      {card.label}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {card.value}
                    </div>
                    <div className="text-sm text-gray-600">{card.delta}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Courses */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      Recommended Courses
                    </h3>
                  </div>
                  {recommendations.courses.length > 0 && (
                    <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3" />
                      <span>{recommendations.courses.length} matches</span>
                    </div>
                  )}
                </div>

                {recommendations.courses.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.courses
                      .slice(0, 3)
                      .map((course, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="font-semibold text-gray-900 mb-1">
                            {course.course_name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {course.duration} • {course.fee_range}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">
                              {course.match_score}% match
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    <button
                      onClick={() => (window.location.href = "/courses")}
                      className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View all {recommendations.courses.length} courses →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Complete your profile to get course recommendations
                    </p>
                    <button
                      onClick={() => (window.location.href = "/onboarding")}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Update Profile →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Universities */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      Top Universities
                    </h3>
                  </div>
                  {recommendations.universities.length > 0 && (
                    <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3" />
                      <span>{recommendations.universities.length} matches</span>
                    </div>
                  )}
                </div>

                {recommendations.universities.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.universities
                      .slice(0, 3)
                      .map((university, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="font-semibold text-gray-900 mb-1">
                            {university.university_name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {university.location} • {university.university_type}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-medium">
                              {university.match_score}% match
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    <button
                      onClick={() => (window.location.href = "/universities")}
                      className="w-full text-center text-purple-600 hover:text-purple-700 font-medium text-sm mt-3 py-2 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      View all {recommendations.universities.length}{" "}
                      universities →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Complete your profile to get university recommendations
                    </p>
                    <button
                      onClick={() => (window.location.href = "/onboarding")}
                      className="mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Update Profile →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Jobs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">
                      Career Opportunities
                    </h3>
                  </div>
                  {recommendations.jobs.length > 0 && (
                    <div className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3" />
                      <span>{recommendations.jobs.length} matches</span>
                    </div>
                  )}
                </div>

                {recommendations.jobs.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.jobs.slice(0, 3).map((job, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          {job.job_title}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {job.industry} • {job.salary_range}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-medium">
                            {job.match_score}% match
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => (window.location.href = "/jobs")}
                      className="w-full text-center text-green-600 hover:text-green-700 font-medium text-sm mt-3 py-2 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      View all {recommendations.jobs.length} careers →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      Complete your profile to get career recommendations
                    </p>
                    <button
                      onClick={() => (window.location.href = "/onboarding")}
                      className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Update Profile →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => (window.location.href = "/chat")}
                className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm">
                    AI Career Advisor
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Get personalized guidance
                  </div>
                </div>
              </button>

              <button className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                  <Map className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm">
                    Career Roadmap
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Visualize your path
                  </div>
                </div>
              </button>

              <button
                onClick={() => (window.location.href = "/onboarding")}
                className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-green-200 hover:bg-green-50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm">
                    Update Profile
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Refine preferences
                  </div>
                </div>
              </button>

              <button className="flex flex-col items-center gap-3 p-6 border-2 border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center transition-colors">
                  <BarChart2 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm">
                    Analytics
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Track your progress
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
