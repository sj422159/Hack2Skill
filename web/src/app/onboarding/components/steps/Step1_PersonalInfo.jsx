import { User } from "lucide-react";

export function Step1_PersonalInfo({ formData, handleInputChange }) {
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
}
