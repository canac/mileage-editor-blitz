import { Autocomplete, AutocompleteProps } from "@mantine/core";
import { useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { useGoogleMapsApi } from "../hooks/useGoogleMapsApi";

export type AddressInputProps = {
  value: string;
};

export function AddressInput({
  value: initialValue,
  onChange,
  ...restProps
}: AddressInputProps & Omit<AutocompleteProps, "data">) {
  const { NEXT_PUBLIC_GOOGLE_API_KEY } = process.env;
  if (!NEXT_PUBLIC_GOOGLE_API_KEY) {
    throw new Error("$NEXT_PUBLIC_GOOGLE_API_KEY environment variable isn't set");
  }

  const [loaded, setLoaded] = useState(false);

  const {
    init,
    value,
    setValue,
    suggestions: { data: suggestionsData },
  } = usePlacesAutocomplete({
    initOnMount: false,
    defaultValue: initialValue,
    requestOptions: {
      componentRestrictions: { country: "us" },
    },
    debounce: 100,
  });

  const googleMaps = useGoogleMapsApi({ apiKey: NEXT_PUBLIC_GOOGLE_API_KEY, libraries: "places" });
  if (!loaded && googleMaps) {
    init();
    setLoaded(true);
  }

  return (
    <Autocomplete
      value={value}
      onChange={(value) => {
        // Remove the USA from the end of the string if present
        const trimmed = value.replace(/, USA$/, "");
        setValue(trimmed);
        onChange?.(trimmed);
      }}
      data={suggestionsData.map((prediction) => prediction.description)}
      {...restProps}
    />
  );
}
