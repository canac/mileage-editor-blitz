import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { faDollarSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "app/core/components/FaIcon";
import { type CSSProperties } from "react";
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
  const { place: place } = props;

  const [updatePlaceMutation] = useMutation(updatePlace);
  const [deletePlaceMutation] = useMutation(deletePlace);

  async function updateField<Field extends keyof UpdatePlace>(
    field: Field,
    value: UpdatePlace[Field],
  ) {
    await updatePlaceMutation({ id: place.id, [field]: value });
  }

  return (
    <div className="form" style={{ display: "flex", gap: "1em", ...props.style }}>
      <TextInput
        label="Name"
        name="name"
        required
        defaultValue={place.name}
        onBlur={(event) => updateField("name", event.target.value)}
        style={{ flex: 1 }}
      />
      <TextInput
        label="Address"
        name="address"
        required
        defaultValue={place.address}
        onBlur={(event) => updateField("address", event.target.value)}
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
