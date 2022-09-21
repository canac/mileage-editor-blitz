import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { faDollarSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "app/core/components/FaIcon";
import { type CSSProperties } from "react";
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

export function JourneyTemplateFormHorizontal(
  props: JourneyTemplateFormProps & { style?: CSSProperties },
) {
  const { journeyTemplate } = props;

  const [updateJourneyTemplateMutation] = useMutation(updateJourneyTemplate);
  const [deleteJourneyTemplateMutation] = useMutation(deleteJourneyTemplate);

  async function updateField<Field extends keyof UpdateJourneyTemplate>(
    field: Field,
    value: UpdateJourneyTemplate[Field],
  ) {
    await updateJourneyTemplateMutation({ id: journeyTemplate.id, [field]: value });
  }

  return (
    <div className="form" style={{ display: "flex", gap: "1em", ...props.style }}>
      <TextInput
        label="Name"
        name="name"
        required
        defaultValue={journeyTemplate.name}
        onBlur={(event) => updateField("name", event.target.value)}
      />
      <TextInput
        label="Description"
        name="description"
        required
        defaultValue={journeyTemplate.description}
        onBlur={(event) => updateField("description", event.target.value)}
      />
      <TextInput
        label="To"
        name="to"
        required
        defaultValue={journeyTemplate.to}
        onBlur={(event) => updateField("to", event.target.value)}
      />
      <TextInput
        label="From"
        name="from"
        required
        defaultValue={journeyTemplate.from}
        onBlur={(event) => updateField("from", event.target.value)}
      />
      <NumberInput
        label="Distance"
        name="distance"
        required
        min={0}
        precision={1}
        step={0.1}
        defaultValue={journeyTemplate.distance / 10}
        onBlur={async (event) => {
          const value = parseFloat(event.target.value);
          if (!Number.isNaN(value)) {
            await updateField("distance", Math.floor(value * 10));
          }
        }}
      />
      <NumberInput
        label="Tolls"
        name="tolls"
        required
        min={0}
        precision={2}
        step={0.01}
        icon={<FaIcon icon={faDollarSign} />}
        defaultValue={journeyTemplate.tolls / 100}
        onBlur={async (event) => {
          const value = parseFloat(event.target.value);
          if (!Number.isNaN(value)) {
            await updateField("tolls", Math.floor(value * 100));
          }
        }}
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
