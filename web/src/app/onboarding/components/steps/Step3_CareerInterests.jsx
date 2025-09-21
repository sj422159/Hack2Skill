import { Heart, Star, Award } from "lucide-react";
import { interestAreas } from "../../constants";

export function Step3_CareerInterests({
  selectedCategory,
  handleCategoryChange,
  selectedSpecializations,
  handleSpecializationToggle,
}) {
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
          <span>
            {selectedSpecializations.length} specializations selected
          </span>
        </div>
      </div>

      <div className="space-y-6">
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
            {Object.keys(interestAreas).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select Specializations in {selectedCategory}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
              {interestAreas[selectedCategory]?.map((specialization) => (
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
            <p>
              Please select a career category to see available specializations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
