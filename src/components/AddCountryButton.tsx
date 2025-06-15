import { useState } from "react";
import { Card, colors } from "../uikit/uikit";
import { hapticFeedback } from "../utils/telegram";
import { useCountries } from "../hooks/useCountries";
import ModalWrapper from "./Modal/ModalWrapper";
import AddItemForm from "./Forms/AddItemForm";

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
      <ModalWrapper
        handleClose={() => {
          hapticFeedback("light");
          setShowForm(false);
        }}
      >
        <AddItemForm
          title="Добавить страну"
          value={countryName}
          placeholder="Название страны"
          setValue={setCountryName}
          isLoading={isLoading}
          error={error || ""}
          handleSubmit={handleSubmit}
        />
      </ModalWrapper>
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
