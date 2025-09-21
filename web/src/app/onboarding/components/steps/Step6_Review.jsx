import { CheckCircle, Loader } from "lucide-react";

export function Step6_Review({ formData, success }) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div
          className={`w-16 h-16 ${
            success
              ? "bg-gradient-to-br from-green-500 to-emerald-500"
              : "bg-gradient-to-br from-gray-500 to-slate-500"
          } rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300`}
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
          {success ? "Profile Created Successfully! 🎉" : "Review Your Profile"}
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
                {formData.areaOfInterest.slice(0, 3).join(", ")}
                {formData.areaOfInterest.length > 3
                  ? ` +${formData.areaOfInterest.length - 3} more`
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
}
