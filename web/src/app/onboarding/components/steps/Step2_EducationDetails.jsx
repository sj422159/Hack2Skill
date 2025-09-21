import { GraduationCap } from "lucide-react";
import { educationLevels } from "../../constants";

export function Step2_EducationDetails({ formData, handleInputChange }) {
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
              onChange={(e) => handleInputChange("gradeType", e.target.value)}
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
}
