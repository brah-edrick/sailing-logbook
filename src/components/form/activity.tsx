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
    <Field.Root color="white" required={required}>
      <Field.Label color="white">{label}</Field.Label>
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
                        <Select.Content color="white">
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
                        <Select.Content color="white">
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
                        <Select.Content color="white">
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
                        <Select.Content color="white">
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
                        <Select.Content color="white">
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
