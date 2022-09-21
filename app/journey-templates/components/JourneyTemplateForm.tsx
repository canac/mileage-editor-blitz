import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { faDollarSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "app/core/components/FaIcon";
import { useEffect, useState, type CSSProperties } from "react";
import { UpdateJourneyTemplate } from "../validators/update";
import updateJourneyTemplate from "../mutations/updateJourneyTemplate";
import { useMutation } from "@blitzjs/rpc";
import { JourneyTemplate } from "@prisma/client";
import deleteJourneyTemplate from "../mutations/deleteJourneyTemplate";
export { FORM_ERROR } from "app/core/components/Form";

export type JourneyTemplateFormProps = {
  journeyTemplate: JourneyTemplate;
  onDelete?: (id: JourneyTemplate["id"]) => void;
};

export function JourneyTemplateForm(props: JourneyTemplateFormProps & { style?: CSSProperties }) {
  const [journeyTemplate, setJourneyTemplate] = useState(props.journeyTemplate);
  useEffect(() => {
    setJourneyTemplate(props.journeyTemplate);
  }, [props.journeyTemplate]);

  const [updateJourneyTemplateMutation] = useMutation(updateJourneyTemplate);
  const [deleteJourneyTemplateMutation] = useMutation(deleteJourneyTemplate);

  function onChange<Field extends keyof UpdateJourneyTemplate>(
    field: Field,
    value: UpdateJourneyTemplate[Field],
  ) {
    setJourneyTemplate({ ...journeyTemplate, [field]: value });
  }

  async function updateField<Field extends keyof UpdateJourneyTemplate>(field: Field) {
    await updateJourneyTemplateMutation({
      id: journeyTemplate.id,
      [field]: journeyTemplate[field],
    });
  }

  return (
    <div className="form" style={{ display: "flex", gap: "1em", ...props.style }}>
      <TextInput
        label="Name"
        name="name"
        required
        value={journeyTemplate.name}
        onChange={(event) => onChange("name", event.currentTarget.value)}
        onBlur={() => updateField("name")}
      />
      <TextInput
        label="Description"
        name="description"
        required
        value={journeyTemplate.description}
        onChange={(event) => onChange("description", event.currentTarget.value)}
        onBlur={(event) => updateField("description")}
      />
      <TextInput
        label="To"
        name="to"
        required
        value={journeyTemplate.to}
        onChange={(event) => onChange("to", event.currentTarget.value)}
        onBlur={() => updateField("to")}
      />
      <TextInput
        label="From"
        name="from"
        required
        value={journeyTemplate.from}
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
        value={journeyTemplate.distance / 10}
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
        value={journeyTemplate.tolls / 100}
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
            const { id } = journeyTemplate;
            await deleteJourneyTemplateMutation({ id });
            props.onDelete?.(id);
          }}
        />
      </ActionIcon>
    </div>
  );
}
