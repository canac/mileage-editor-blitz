import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { faDollarSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "app/core/components/FaIcon";
import { useEffect, useState, type CSSProperties } from "react";
import updateJourney, { UpdateJourneyInput } from "../mutations/updateJourney";
import { useMutation } from "@blitzjs/rpc";
import { Journey } from "@prisma/client";
import deleteJourney from "../mutations/deleteJourney";

export type JourneyFormProps = {
  journey: Journey;
  onDelete?: (id: Journey["id"]) => void;
};

export function JourneyForm(props: JourneyFormProps & { style?: CSSProperties }) {
  const [journey, setJourney] = useState(props.journey);
  useEffect(() => {
    setJourney(props.journey);
  }, [props.journey]);

  const [updateJourneyMutation] = useMutation(updateJourney);
  const [deleteJourneyMutation] = useMutation(deleteJourney);

  function onChange<Field extends keyof UpdateJourneyInput>(
    field: Field,
    value: UpdateJourneyInput[Field],
  ) {
    setJourney({ ...journey, [field]: value });
  }

  async function updateField<Field extends keyof UpdateJourneyInput>(field: Field) {
    await updateJourneyMutation({
      id: journey.id,
      [field]: journey[field],
    });
  }

  return (
    <div className="form" style={{ display: "flex", gap: "1em", ...props.style }}>
      <TextInput
        label="Description"
        name="description"
        required
        value={journey.description}
        onChange={(event) => onChange("description", event.currentTarget.value)}
        onBlur={() => updateField("description")}
      />
      <TextInput
        label="To"
        name="to"
        required
        value={journey.to}
        onChange={(event) => onChange("to", event.currentTarget.value)}
        onBlur={() => updateField("to")}
      />
      <TextInput
        label="From"
        name="from"
        required
        value={journey.from}
        onChange={(event) => onChange("from", event.currentTarget.value)}
        onBlur={() => updateField("from")}
      />
      <NumberInput
        label="Distance"
        name="distance"
        required
        min={0}
        precision={1}
        step={0.1}
        value={journey.distance / 10}
        onChange={(value) => {
          if (typeof value !== "undefined") {
            onChange("distance", value * 10);
          }
        }}
        onBlur={() => updateField("distance")}
      />
      <NumberInput
        label="Tolls"
        name="tolls"
        required
        min={0}
        precision={2}
        step={0.01}
        icon={<FaIcon icon={faDollarSign} />}
        value={journey.tolls / 100}
        onChange={(value) => {
          if (typeof value !== "undefined") {
            onChange("tolls", value * 100);
          }
        }}
        onBlur={() => updateField("tolls")}
      />
      <ActionIcon color="red" size="lg" style={{ alignSelf: "center" }}>
        <FaIcon
          icon={faTrash}
          size="lg"
          onClick={async () => {
            const { id } = journey;
            await deleteJourneyMutation({ id });
            props.onDelete?.(id);
          }}
        />
      </ActionIcon>
    </div>
  );
}
