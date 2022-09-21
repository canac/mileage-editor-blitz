import { ActionIcon, TextInput } from "@mantine/core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "app/core/components/FaIcon";
import { useEffect, useState, type CSSProperties } from "react";
import { UpdatePlace } from "../validators/update";
import updatePlace from "../mutations/updatePlace";
import { useMutation } from "@blitzjs/rpc";
import { Place } from "@prisma/client";
import deletePlace from "../mutations/deletePlace";
export { FORM_ERROR } from "app/core/components/Form";

export type PlaceFormProps = {
  place: Place;
  onDelete?: (id: Place["id"]) => void;
};

export function PlaceForm(props: PlaceFormProps & { style?: CSSProperties }) {
  const [place, setPlace] = useState(props.place);
  useEffect(() => {
    setPlace(props.place);
  }, [props.place]);

  const [updatePlaceMutation] = useMutation(updatePlace);
  const [deletePlaceMutation] = useMutation(deletePlace);

  function onChange<Field extends keyof UpdatePlace>(field: Field, value: UpdatePlace[Field]) {
    setPlace({ ...place, [field]: value });
  }

  async function updateField<Field extends keyof UpdatePlace>(field: Field) {
    await updatePlaceMutation({ id: place.id, [field]: place[field] });
  }

  return (
    <div className="form" style={{ display: "flex", gap: "1em", ...props.style }}>
      <TextInput
        label="Name"
        name="name"
        required
        value={place.name}
        onChange={(event) => onChange("name", event.currentTarget.value)}
        onBlur={() => updateField("name")}
        style={{ flex: 1 }}
      />
      <TextInput
        label="Address"
        name="address"
        required
        value={place.address}
        onChange={(event) => onChange("address", event.currentTarget.value)}
        onBlur={() => updateField("address")}
        style={{ flex: 3 }}
      />
      <ActionIcon color="red" size="lg" style={{ alignSelf: "center" }}>
        <FaIcon
          icon={faTrash}
          size="lg"
          onClick={async () => {
            const { id } = place;
            await deletePlaceMutation({ id });
            props.onDelete?.(id);
          }}
        />
      </ActionIcon>
    </div>
  );
}
