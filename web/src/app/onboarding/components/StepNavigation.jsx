import { ArrowRight, ArrowLeft, CheckCircle, Loader } from "lucide-react";

export function StepNavigation({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
  handleSubmit,
  isStepValid,
  isSubmitting,
  success,
}) {
  return (
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
          disabled={!isStepValid}
          className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-200 font-medium ${
            isStepValid
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
          disabled={!isStepValid || isSubmitting || success}
          className={`flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-200 font-medium ${
            isStepValid && !isSubmitting && !success
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
  );
}
