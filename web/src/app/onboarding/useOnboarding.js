"use client";
import { useState, useCallback } from "react";
import { totalSteps, interestAreas } from "./constants";

const initialFormData = {
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
};

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Clear specializations when category changes
    const newSpecializations = selectedSpecializations.filter(
      (spec) => !interestAreas[category]?.includes(spec),
    );
    setSelectedSpecializations(newSpecializations);
    handleInputChange("areaOfInterest", newSpecializations);
  };

  const handleSpecializationToggle = (specialization) => {
    const newSpecializations = selectedSpecializations.includes(specialization)
      ? selectedSpecializations.filter((item) => item !== specialization)
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
        headers: { "Content-Type": "application/json" },
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
            headers: { "Content-Type": "application/json" },
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

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.age;
      case 2:
        return formData.educationLevel && formData.gradePercentage;
      case 3:
        return formData.areaOfInterest.length > 0;
      case 4:
        return formData.budgetMin && formData.budgetMax;
      case 5:
        return formData.accommodationType && formData.preferredLocation;
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  return {
    currentStep,
    totalSteps,
    formData,
    handleInputChange,
    nextStep,
    prevStep,
    isStepValid,
    isSubmitting,
    error,
    success,
    handleSubmit,
    selectedCategory,
    handleCategoryChange,
    selectedSpecializations,
    handleSpecializationToggle,
  };
}
