import { useState } from "react";
import { Card, colors } from "../uikit/uikit";
import { hapticFeedback } from "../utils/telegram";
import AddCountryForm from "./AddCountryForm";
import { useCountries } from "../hooks/useCountries";

export const AddCountryButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createCountry } = useCountries();

  const handleSubmit = async () => {
    if (!countryName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await createCountry(countryName.trim());
      setCountryName("");
      setShowForm(false);
      hapticFeedback("light");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create country"
      );
      hapticFeedback("heavy");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForm) {
    return (
      <AddCountryForm
        value={countryName}
        setValue={setCountryName}
        isLoading={isLoading}
        error={error || ""}
        handleClose={() => {
          hapticFeedback("light");
          setShowForm(false);
        }}
        handleSubmit={handleSubmit}
      />
    );
  }

  return (
    <Card
      style={{ backgroundColor: colors.nudePink }}
      onClick={() => {
        hapticFeedback("light");
        setShowForm(true);
      }}
    >
      +
    </Card>
  );
};
