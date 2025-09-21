import { DollarSign, Award } from "lucide-react";

export function Step4_BudgetRange({ formData, handleInputChange }) {
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
              onChange={(e) => handleInputChange("budgetMin", e.target.value)}
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
              onChange={(e) => handleInputChange("budgetMax", e.target.value)}
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
            Consider all costs including tuition, accommodation, and living
            expenses when setting your budget.
          </p>
        </div>
      </div>
    </div>
  );
}
