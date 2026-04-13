import { useCallback, useEffect, useRef, useState } from "react";

const ZIP_LOOKUP_ERROR = "Please enter a valid ZIP code";

export const normalizeZipCode = (value = "") =>
  value.toString().replace(/\D/g, "").slice(0, 5);

const getZipLengthError = (zipCode: string) => {
  if (!zipCode) {
    return "Zip cannot be empty";
  }

  return "ZIP must be 5 digits";
};

const useZipCodeLookup = ({
  zipCode,
  onZipCodeChange,
  onLookupSuccess,
  onValidityChange,
  state,
  city,
}) => {
  const [zipError, setZipError] = useState("");
  const [isZipValid, setIsZipValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatedZipRef = useRef("");
  const inFlightZipRef = useRef("");

  const updateValidity = useCallback(
    (value) => {
      setIsZipValid(value);
      if (onValidityChange) {
        onValidityChange(value);
      }
    },
    [onValidityChange]
  );

  const clearZipValidation = useCallback(() => {
    validatedZipRef.current = "";
    updateValidity(false);
  }, [updateValidity]);

  const handleZipCodeChange = useCallback(
    (value) => {
      const nextZipCode = normalizeZipCode(value);

      // ✅ BLOCK typing validation
      if (nextZipCode && (!state || !city)) {
        setZipError("Please select state and city first");
        clearZipValidation();
        onZipCodeChange(nextZipCode);
        return nextZipCode;
      }

      if (nextZipCode !== validatedZipRef.current) {
        clearZipValidation();
      }

      // ✅ ADD THIS BLOCK (your requirement)
      if (state && city) {
        if (nextZipCode.length > 0 && nextZipCode.length < 5) {
          setZipError(ZIP_LOOKUP_ERROR); // "Please enter a valid ZIP code"
        } else if (nextZipCode.length === 5) {
          setZipError(""); // clear error when valid length
        } else {
          setZipError("");
        }
      }

      onZipCodeChange(nextZipCode);
      return nextZipCode;
    },
    [clearZipValidation, onZipCodeChange, state, city]
  );

  const lookupZipCode = useCallback(
    async (customZipCode?: string) => {
      const nextZipCode = normalizeZipCode(customZipCode ?? zipCode);

      // ✅ BLOCK API call
      if (nextZipCode && (!state || !city)) {
        clearZipValidation();
        setZipError("Please select state and city first");
        return false;
      }

      if (!nextZipCode || nextZipCode.length !== 5) {
        clearZipValidation();
        setZipError(getZipLengthError(nextZipCode));
        return false;
      }

      if (inFlightZipRef.current === nextZipCode) {
        return false;
      }

      if (validatedZipRef.current === nextZipCode && isZipValid) {
        return true;
      }

      inFlightZipRef.current = nextZipCode;
      setIsLoading(true);
      setZipError("");

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ZIP_BASE_URL}/zip/${nextZipCode}`);
        const data = await response.json().catch(() => ({}));
        const city = data?.city?.toString()?.trim?.() || "";
        const state = data?.state?.toString()?.trim?.() || "";

        if (!response.ok || !city || !state) {
          throw new Error("Invalid ZIP response");
        }

        validatedZipRef.current = nextZipCode;
        updateValidity(true);
        setZipError("");

        if (onLookupSuccess) {
          onLookupSuccess({
            ...data,
            city,
            state,
            zip_code: nextZipCode,
          });
        }

        return true;
      } catch (error) {
        clearZipValidation();
        setZipError(ZIP_LOOKUP_ERROR);
        return false;
      } finally {
        if (inFlightZipRef.current === nextZipCode) {
          inFlightZipRef.current = "";
        }

        setIsLoading(false);
      }
    },
    [clearZipValidation, isZipValid, onLookupSuccess, updateValidity, zipCode]
  );

  const validateZipCodeField = useCallback(
    (value) => {
      if (isLoading) {
        return true;
      }

      const nextZipCode = normalizeZipCode(value ?? zipCode);

      // ✅ VALIDATION
      if (!state || !city) {
        setZipError("Please select state and city first");
        return false;
      }

      if (!nextZipCode) {
        setZipError("Zip cannot be empty");
        return false;
      }

      if (nextZipCode.length !== 5) {
        setZipError("Please enter a 5-digit ZIP code");
        return false;
      }

      if (!isZipValid) {
        setZipError(ZIP_LOOKUP_ERROR);
        return false;
      }

      setZipError("");
      return true;
    },
    [isLoading, isZipValid, zipCode, state, city]
  );

  useEffect(() => {
    const nextZipCode = normalizeZipCode(zipCode);

    if (nextZipCode.length === 5) {
      lookupZipCode(nextZipCode);
    }
  }, [lookupZipCode, zipCode]);

  return {
    handleZipCodeChange,
    isLoading,
    isZipValid,
    lookupZipCode,
    setZipError,
    validateZipCodeField,
    zipError,
  };
};

export default useZipCodeLookup;
