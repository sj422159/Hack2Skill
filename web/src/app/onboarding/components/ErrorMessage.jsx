import { AlertCircle } from "lucide-react";

export function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  );
}
