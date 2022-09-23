import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { faCopy, faDollarSign, faHome, faRoute, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "app/core/components/FaIcon";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import createJourney from "../mutations/createJourney";
import updateJourney, { UpdateJourneyInput } from "../mutations/updateJourney";
import deleteJourney from "../mutations/deleteJourney";
import { useMutation } from "@blitzjs/rpc";
import { Journey, JourneyTemplate, Place } from "@prisma/client";

export type JourneyFormProps = {
  journey: Journey;
  places: Place[];
  journeyTemplates: JourneyTemplate[];
  onChange?: () => void;
};

export function JourneyForm(props: JourneyFormProps & { style?: CSSProperties }) {
  const [journey, setJourney] = useState(props.journey);
  useEffect(() => {
    setJourney(props.journey);
  }, [props.journey]);

  const [createJourneyMutation] = useMutation(createJourney);
  const [updateJourneyMutation] = useMutation(updateJourney);
  const [deleteJourneyMutation] = useMutation(deleteJourney);

  const places = useMemo(
    () => new Map(props.places.map((place) => [place.name.toLowerCase(), place.address])),
    [props.places],
  );
  const templates = useMemo(
    () =>
      new Map(props.journeyTemplates.map((template) => [template.name.toLowerCase(), template])),
    [props.journeyTemplates],
  );

  function onChange<Field extends keyof UpdateJourneyInput>(
    field: Field,
    value: Required<UpdateJourneyInput>[Field],
  ) {
    setJourney({ ...journey, [field]: value });
  }

  // Expand the address into a place's address if possible, otherwise return the address unchanged
  function expandAddress(address: string): string {
    return places.get(address.toLowerCase()) ?? address;
  }

  async function updateField<Field extends keyof UpdateJourneyInput>(field: Field) {
    // Expand the description into a journey template if possible
    if (field === "description") {
      const template = templates.get(journey.description.toLowerCase());
      if (template) {
        const updatedFields = {
          description: template.description,
          from: template.from,
          to: template.to,
          distance: template.distance,
          tolls: template.tolls,
        };

        setJourney({
          ...journey,
          ...updatedFields,
        });

        await updateJourneyMutation({
          id: journey.id,
          ...updatedFields,
        });
        return;
      }
    }

    await updateJourneyMutation({
      id: journey.id,
      [field]: journey[field],
    });
  }

  return (
    <div className="form" style={{ display: "flex", gap: "1em", ...props.style }}>
      <TextInput
        label="Date"
        name="date"
        type="date"
        required
        value={journey.date}
        onChange={(event) => onChange("date", event.currentTarget.value)}
        onBlur={() => updateField("date")}
      />
      <TextInput
        label="Description"
        name="description"
        required
        value={journey.description}
        onChange={(event) => onChange("description", event.currentTarget.value)}
        onBlur={() => updateField("description")}
      />
      <TextInput
        label="From"
        name="from"
        required
        value={journey.from}
        onChange={(event) => onChange("from", expandAddress(event.currentTarget.value))}
        onBlur={() => updateField("from")}
      />
      <TextInput
        label="To"
        name="to"
        required
        value={journey.to}
        onChange={(event) => onChange("to", expandAddress(event.currentTarget.value))}
        onBlur={() => updateField("to")}
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
      <ActionIcon size="lg" style={{ alignSelf: "center" }}>
        <FaIcon
          icon={faCopy}
          size="lg"
          onClick={async () => {
            const { date, description, from, to, distance, tolls, reportId } = journey;
            await createJourneyMutation({
              date,
              description,
              from,
              to,
              distance,
              tolls,
              reportId,
            });
            props.onChange?.();
          }}
        />
      </ActionIcon>
      <ActionIcon size="lg" style={{ alignSelf: "center" }}>
        <FaIcon
          icon={faRoute}
          size="lg"
          onClick={async () => {
            await createJourneyMutation({
              date: journey.date,
              description: "",
              from: journey.to,
              to: "",
              distance: 0,
              tolls: 0,
              reportId: journey.reportId,
            });
            props.onChange?.();
          }}
        />
      </ActionIcon>
      <ActionIcon size="lg" style={{ alignSelf: "center" }}>
        <FaIcon
          icon={faHome}
          size="lg"
          onClick={async () => {
            await createJourneyMutation({
              date: journey.date,
              description: journey.description,
              from: journey.to,
              to: expandAddress("home"),
              distance: 0,
              tolls: 0,
              reportId: journey.reportId,
            });
            props.onChange?.();
          }}
        />
      </ActionIcon>
      <ActionIcon color="red" size="lg" style={{ alignSelf: "center" }}>
        <FaIcon
          icon={faTrash}
          size="lg"
          onClick={async () => {
            await deleteJourneyMutation({ id: journey.id });
            props.onChange?.();
          }}
        />
      </ActionIcon>
    </div>
  );
}
