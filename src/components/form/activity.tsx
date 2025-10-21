"use client";

import {
  Field,
  createListCollection,
  Stack,
  Box,
  Fieldset,
  Grid,
  Select,
  Flex,
  Portal,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { Boat } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { ApiSailingActivity, ApiBoat } from "@/types/api";

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
}) => {
  return (
    <Field.Root required={required}>
      <Field.Label>{label}</Field.Label>
      {children}
    </Field.Root>
  );
};

export type ActivityFormFields = {
  boatId: string;
  startTime: string;
  endTime: string;
  departureLocation: string;
  returnLocation: string;
  distanceNm: string;
  avgSpeedKnots: string;
  weatherConditions: string;
  windSpeedKnots: string;
  windDirection: string;
  seaState: string;
  sailConfiguration: string;
  purpose: string;
  notes: string;
};

const seaStateCollection = createListCollection({
  items: [
    { label: "Calm", value: "calm" },
    { label: "Light", value: "light" },
    { label: "Moderate", value: "moderate" },
    { label: "Rough", value: "rough" },
  ],
});

const windDirectionCollection = createListCollection({
  items: [
    { label: "N", value: "n" },
    { label: "NE", value: "ne" },
    { label: "E", value: "e" },
    { label: "SE", value: "se" },
    { label: "S", value: "s" },
    { label: "SW", value: "sw" },
    { label: "W", value: "w" },
    { label: "NW", value: "nw" },
  ],
});

const conditionCollection = createListCollection({
  items: [
    { label: "Sunny", value: "sunny" },
    { label: "Cloudy", value: "cloudy" },
    { label: "Rainy", value: "rainy" },
    { label: "Foggy", value: "foggy" },
    { label: "Other", value: "other" },
    { label: "Stormy", value: "stormy" },
  ],
});

const purposeCollection = createListCollection({
  items: [
    { label: "Racing", value: "racing" },
    { label: "Cruising", value: "cruising" },
    { label: "Training", value: "training" },
    { label: "Charter", value: "charter" },
    { label: "Delivery", value: "delivery" },
    { label: "Other", value: "other" },
  ],
});

export type ActivityFormProps = {
  onSubmit: (form: ActivityFormFields) => void;
  initialValues: ActivityFormFields;
  submitButtonText: string;
  boats: Boat[];
};

export const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText,
  boats,
}) => {
  const [form, setForm] = useState(initialValues);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const boatsCollection = createListCollection({
    items: boats.map((boat) => ({
      label: boat.name,
      value: boat.id.toString(),
      id: boat.id,
      colorHex: boat.colorHex,
    })),
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" gap="4">
        <Box border="1px solid" borderColor="gray.800" borderRadius="md" p="4">
          <Fieldset.Root>
            <Fieldset.Legend>Activity Details</Fieldset.Legend>
            <Fieldset.Content>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <FormField label="Boat" required>
                  <Select.Root
                    collection={boatsCollection}
                    onValueChange={(details) =>
                      setForm({ ...form, boatId: details.value[0] })
                    }
                    value={form.boatId ? [form.boatId] : []}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Flex alignItems="center" gap="2">
                          <Box
                            style={{
                              backgroundColor: form.boatId
                                ? boatsCollection.items.find(
                                    (boat) => boat.value === form.boatId
                                  )?.colorHex || "white"
                                : "white",
                            }}
                            borderRadius="full"
                            boxSize="12px"
                          />
                          <Select.ValueText placeholder="Select boat" />
                        </Flex>
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {boatsCollection.items.map((boat) => (
                            <Select.Item item={boat} key={boat.value}>
                              <Select.ItemText>
                                <Flex alignItems="center" gap="2">
                                  <Box
                                    style={{
                                      backgroundColor: boat.colorHex || "white",
                                    }}
                                    borderRadius="full"
                                    boxSize="12px"
                                  />
                                  {boat.label}
                                </Flex>
                              </Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormField>
                <FormField label="Start Time" required>
                  <Input
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    type="datetime-local"
                  />
                </FormField>
                <FormField label="End Time" required>
                  <Input
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    type="datetime-local"
                  />
                </FormField>
                <FormField label="Purpose">
                  <Select.Root
                    collection={purposeCollection}
                    onValueChange={(details) =>
                      setForm({ ...form, purpose: details.value[0] })
                    }
                    value={form.purpose ? [form.purpose] : []}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Racing, Cruising, Training, Charter, Delivery, Other" />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {purposeCollection.items.map((purpose) => (
                            <Select.Item item={purpose} key={purpose.value}>
                              <Select.ItemText>{purpose.label}</Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormField>
              </Grid>
            </Fieldset.Content>
          </Fieldset.Root>
        </Box>

        <Box border="1px solid" borderColor="gray.800" borderRadius="md" p="4">
          <Fieldset.Root>
            <Fieldset.Legend>Location & Navigation</Fieldset.Legend>
            <Fieldset.Content>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <FormField label="Departure Location">
                  <Input
                    name="departureLocation"
                    value={form.departureLocation}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField label="Return Location">
                  <Input
                    name="returnLocation"
                    value={form.returnLocation}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField label="Distance (NM)">
                  <Input
                    name="distanceNm"
                    value={form.distanceNm}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                  />
                </FormField>
                <FormField label="Average Speed (knots)">
                  <Input
                    name="avgSpeedKnots"
                    value={form.avgSpeedKnots}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                  />
                </FormField>
              </Grid>
            </Fieldset.Content>
          </Fieldset.Root>
        </Box>

        <Box border="1px solid" borderColor="gray.800" borderRadius="md" p="4">
          <Fieldset.Root>
            <Fieldset.Legend>Weather & Conditions</Fieldset.Legend>
            <Fieldset.Content>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <FormField label="Weather Conditions">
                  <Select.Root
                    collection={conditionCollection}
                    onValueChange={(details) =>
                      setForm({ ...form, weatherConditions: details.value[0] })
                    }
                    value={
                      form.weatherConditions ? [form.weatherConditions] : []
                    }
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Sunny, Cloudy, Rainy, Foggy, Other, Stormy" />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {conditionCollection.items.map((condition) => (
                            <Select.Item item={condition} key={condition.value}>
                              <Select.ItemText>
                                {condition.label}
                              </Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormField>
                <FormField label="Wind Speed (knots)">
                  <Input
                    name="windSpeedKnots"
                    value={form.windSpeedKnots}
                    onChange={handleChange}
                    type="number"
                    step="0.1"
                  />
                </FormField>
                <FormField label="Wind Direction">
                  <Select.Root
                    collection={windDirectionCollection}
                    onValueChange={(details) =>
                      setForm({ ...form, windDirection: details.value[0] })
                    }
                    value={form.windDirection ? [form.windDirection] : []}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="N, NE, E, SE, S, SW, W, NW" />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {windDirectionCollection.items.map(
                            (windDirection) => (
                              <Select.Item
                                item={windDirection}
                                key={windDirection.value}
                              >
                                <Select.ItemText>
                                  {windDirection.label}
                                </Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                            )
                          )}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormField>
                <FormField label="Sea State">
                  <Select.Root
                    collection={seaStateCollection}
                    onValueChange={(details) =>
                      setForm({ ...form, seaState: details.value[0] })
                    }
                    value={form.seaState ? [form.seaState] : []}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select sea state" />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {seaStateCollection.items.map((seaState) => (
                            <Select.Item item={seaState} key={seaState.value}>
                              <Select.ItemText>
                                {seaState.label}
                              </Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormField>
                <FormField label="Sail Configuration">
                  <Input
                    name="sailConfiguration"
                    value={form.sailConfiguration}
                    onChange={handleChange}
                    placeholder="Main + Jib, Full sail, Reefed, etc."
                  />
                </FormField>
                <FormField label="Notes">
                  <Textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </FormField>
              </Grid>
            </Fieldset.Content>
          </Fieldset.Root>
        </Box>
      </Stack>

      <Flex justifyContent="end">
        <Button variant="surface" type="submit" mt="6" size="lg">
          {submitButtonText}
        </Button>
      </Flex>
    </form>
  );
};

// Edit Activity Form Component
interface EditActivityFormProps {
  activity: ApiSailingActivity;
  boats: ApiBoat[];
}

export function EditActivityForm({ activity, boats }: EditActivityFormProps) {
  const router = useRouter();

  const handleSubmit = async (formData: ActivityFormFields) => {
    const payload = {
      boatId: Number(formData.boatId),
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      departureLocation: formData.departureLocation || null,
      returnLocation: formData.returnLocation || null,
      distanceNm: formData.distanceNm ? Number(formData.distanceNm) : null,
      avgSpeedKnots: formData.avgSpeedKnots
        ? Number(formData.avgSpeedKnots)
        : null,
      weatherConditions: formData.weatherConditions || null,
      windSpeedKnots: formData.windSpeedKnots
        ? Number(formData.windSpeedKnots)
        : null,
      windDirection: formData.windDirection || null,
      seaState: formData.seaState || null,
      sailConfiguration: formData.sailConfiguration || null,
      purpose: formData.purpose || null,
      notes: formData.notes || null,
    };

    try {
      const res = await fetch(`/api/activities/${activity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toaster.create({
          title: "Success",
          description: "Activity updated successfully",
          type: "success",
        });
        router.push(`/activities/${activity.id}`);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to update activity",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error updating activity",
        type: "error",
      });
    }
  };

  // Format datetime for datetime-local input
  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialValues: ActivityFormFields = {
    boatId: activity.boatId?.toString() || "",
    startTime: formatDateTimeLocal(activity.startTime),
    endTime: formatDateTimeLocal(activity.endTime),
    departureLocation: activity.departureLocation || "",
    returnLocation: activity.returnLocation || "",
    distanceNm: activity.distanceNm?.toString() || "",
    avgSpeedKnots: activity.avgSpeedKnots?.toString() || "",
    weatherConditions: activity.weatherConditions || "",
    windSpeedKnots: activity.windSpeedKnots?.toString() || "",
    windDirection: activity.windDirection || "",
    seaState: activity.seaState || "",
    sailConfiguration: activity.sailConfiguration || "",
    purpose: activity.purpose || "",
    notes: activity.notes || "",
  };

  return (
    <ActivityForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitButtonText="Update Activity"
      boats={boats}
    />
  );
}

// New Activity Form Component
interface NewActivityFormProps {
  boats: ApiBoat[];
  boatIdFromParams?: string;
}

export function NewActivityForm({
  boats,
  boatIdFromParams,
}: NewActivityFormProps) {
  const router = useRouter();

  const initialValues: ActivityFormFields = {
    boatId: boatIdFromParams || "",
    startTime: "",
    endTime: "",
    departureLocation: "",
    returnLocation: "",
    distanceNm: "",
    avgSpeedKnots: "",
    weatherConditions: "",
    windSpeedKnots: "",
    windDirection: "",
    seaState: "",
    sailConfiguration: "",
    purpose: "",
    notes: "",
  };

  const handleSubmit = async (activity: ActivityFormFields) => {
    try {
      const payload = {
        boatId: Number(activity.boatId),
        startTime: new Date(activity.startTime).toISOString(),
        endTime: new Date(activity.endTime).toISOString(),
        departureLocation: activity.departureLocation || null,
        returnLocation: activity.returnLocation || null,
        distanceNm: activity.distanceNm ? Number(activity.distanceNm) : null,
        avgSpeedKnots: activity.avgSpeedKnots
          ? Number(activity.avgSpeedKnots)
          : null,
        weatherConditions: activity.weatherConditions || null,
        windSpeedKnots: activity.windSpeedKnots
          ? Number(activity.windSpeedKnots)
          : null,
        windDirection: activity.windDirection || null,
        seaState: activity.seaState || null,
        sailConfiguration: activity.sailConfiguration || null,
        purpose: activity.purpose || null,
        notes: activity.notes || null,
      };

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toaster.create({
          title: "Success",
          description: "Activity created successfully",
          type: "success",
        });
        router.push(`/activities`);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to create activity",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Network error while creating activity",
        type: "error",
      });
    }
  };

  return (
    <ActivityForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitButtonText="Add Activity"
      boats={boats}
    />
  );
}
