import { Home } from "lucide-react";
import { accommodationTypes } from "../../constants";

export function Step5_Accommodation({ formData, handleInputChange }) {
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
}
