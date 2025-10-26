"use client";

import {
  Field,
  Stack,
  Box,
  Grid,
  Input,
  Textarea,
  Flex,
  Button,
  createListCollection,
  Select,
  Portal,
  NumberInput,
} from "@chakra-ui/react";
import { Card } from "@/components/card";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  activityFormSchema,
  type ActivityFormInput,
  type WeatherCondition,
  type WindDirection,
  type SeaState,
  type ActivityPurpose,
} from "@/validation/schemas";
import { ApiBoat } from "@/types/api";

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  error,
}) => {
  return (
    <Field.Root required={required} invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      {children}
      {error && (
        <Field.ErrorText color="red.500" fontSize="sm">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
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

const boatCollection = (boats: ApiBoat[]) =>
  createListCollection({
    items: boats.map((boat) => ({
      label: boat.name,
      value: boat.id.toString(),
    })),
  });

export type ActivityFormProps = {
  onSubmit: (form: ActivityFormInput) => void;
  initialValues: Partial<ActivityFormInput>;
  submitButtonText: string;
  boats: ApiBoat[];
  isLoading?: boolean;
};

export const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText,
  boats,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<ActivityFormInput>({
    resolver: zodResolver(activityFormSchema),
    mode: "onBlur",
    defaultValues: {
      boatId: initialValues.boatId || "",
      startTime: initialValues.startTime || "",
      endTime: initialValues.endTime || "",
      departureLocation: initialValues.departureLocation || "",
      returnLocation: initialValues.returnLocation || "",
      distanceNm: initialValues.distanceNm || "",
      avgSpeedKnots: initialValues.avgSpeedKnots || "",
      weatherConditions: initialValues.weatherConditions || null,
      windSpeedKnots: initialValues.windSpeedKnots || "",
      windDirection: initialValues.windDirection || null,
      seaState: initialValues.seaState || null,
      sailConfiguration: initialValues.sailConfiguration || "",
      purpose: initialValues.purpose || null,
      notes: initialValues.notes || "",
    },
  });

  const handleFormSubmit = (data: ActivityFormInput) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack direction="column" gap="4" mt="4">
        {/* Header Section */}
        <Box>
          <Box
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            mb="2"
          >
            {submitButtonText.includes("Add")
              ? "Log New Activity"
              : "Edit Activity"}
          </Box>
          <Box color="fg.muted" fontSize="sm">
            {submitButtonText.includes("Add")
              ? "Record your sailing adventure with detailed information about conditions and performance."
              : "Update your sailing activity details to keep your log accurate."}
          </Box>
        </Box>

        {/* Basic Information */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Basic Information
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Essential details about your sailing activity
            </Box>
          </Box>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: "4", md: "6" }}
          >
            <FormField label="Boat" required error={errors.boatId?.message}>
              <Select.Root
                collection={boatCollection(boats)}
                value={[watch("boatId")]}
                onValueChange={(details) =>
                  setValue("boatId", details.value[0] || "")
                }
              >
                <Select.Trigger
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                >
                  <Select.ValueText placeholder="Select a boat" />
                  <Select.Indicator />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content position="popper">
                      <Select.ItemGroup>
                        {boatCollection(boats).items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </FormField>

            <FormField label="Activity Purpose" error={errors.purpose?.message}>
              <Select.Root
                collection={purposeCollection}
                value={watch("purpose") ? [watch("purpose")!] : []}
                onValueChange={(details) =>
                  setValue(
                    "purpose",
                    (details.value[0] as ActivityPurpose | null) || null
                  )
                }
              >
                <Select.Trigger
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                >
                  <Select.ValueText placeholder="Select purpose" />
                  <Select.Indicator />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content position="popper">
                      <Select.ItemGroup>
                        {purposeCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </FormField>

            <FormField
              label="Start Time"
              required
              error={errors.startTime?.message}
            >
              <Input
                {...register("startTime")}
                type="datetime-local"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField
              label="End Time"
              required
              error={errors.endTime?.message}
            >
              <Input
                {...register("endTime")}
                type="datetime-local"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>
          </Grid>
        </Card>

        {/* Location & Navigation */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Location & Navigation
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Track your journey and sailing performance
            </Box>
          </Box>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: "4", md: "6" }}
          >
            <FormField
              label="Departure Location"
              error={errors.departureLocation?.message}
            >
              <Input
                {...register("departureLocation")}
                placeholder="e.g., Newport Harbor"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField
              label="Return Location"
              error={errors.returnLocation?.message}
            >
              <Input
                {...register("returnLocation")}
                placeholder="e.g., Block Island"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField label="Distance" error={errors.distanceNm?.message}>
              <NumberInput.Root
                value={watch("distanceNm") || ""}
                onValueChange={(details) =>
                  setValue("distanceNm", details.value.toString())
                }
                step={1}
                min={0}
                width="100%"
                formatOptions={{
                  style: "decimal",
                }}
              >
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input
                  placeholder="15.5"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </NumberInput.Root>
            </FormField>

            <FormField
              label="Average Speed"
              error={errors.avgSpeedKnots?.message}
            >
              <NumberInput.Root
                value={watch("avgSpeedKnots") || ""}
                onValueChange={(details) =>
                  setValue("avgSpeedKnots", details.value.toString())
                }
                step={1}
                min={0}
                width="100%"
                formatOptions={{
                  style: "decimal",
                }}
              >
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input
                  placeholder="6.2"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </NumberInput.Root>
            </FormField>
          </Grid>
        </Card>

        {/* Weather & Conditions */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Weather & Conditions
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Record the sailing conditions and environmental factors
            </Box>
          </Box>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={{ base: "4", md: "6" }}
          >
            <FormField
              label="Weather"
              error={errors.weatherConditions?.message}
            >
              <Select.Root
                collection={conditionCollection}
                value={
                  watch("weatherConditions")
                    ? [watch("weatherConditions")!]
                    : []
                }
                onValueChange={(details) =>
                  setValue(
                    "weatherConditions",
                    (details.value[0] as WeatherCondition | null) || null
                  )
                }
              >
                <Select.Trigger
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                >
                  <Select.ValueText placeholder="Select weather" />
                  <Select.Indicator />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content position="popper">
                      <Select.ItemGroup>
                        {conditionCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </FormField>

            <FormField
              label="Wind Speed"
              error={errors.windSpeedKnots?.message}
            >
              <NumberInput.Root
                value={watch("windSpeedKnots") || ""}
                onValueChange={(details) =>
                  setValue("windSpeedKnots", details.value.toString())
                }
                step={1}
                min={0}
                width="100%"
                formatOptions={{
                  style: "decimal",
                }}
              >
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input
                  placeholder="12"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </NumberInput.Root>
            </FormField>

            <FormField
              label="Wind Direction"
              error={errors.windDirection?.message}
            >
              <Select.Root
                collection={windDirectionCollection}
                value={watch("windDirection") ? [watch("windDirection")!] : []}
                onValueChange={(details) =>
                  setValue(
                    "windDirection",
                    (details.value[0] as WindDirection | null) || null
                  )
                }
              >
                <Select.Trigger
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                >
                  <Select.ValueText placeholder="Select direction" />
                  <Select.Indicator />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content position="popper">
                      <Select.ItemGroup>
                        {windDirectionCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </FormField>

            <FormField label="Sea State" error={errors.seaState?.message}>
              <Select.Root
                collection={seaStateCollection}
                value={watch("seaState") ? [watch("seaState")!] : []}
                onValueChange={(details) =>
                  setValue(
                    "seaState",
                    (details.value[0] as SeaState | null) || null
                  )
                }
              >
                <Select.Trigger
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                >
                  <Select.ValueText placeholder="Select sea state" />
                  <Select.Indicator />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content position="popper">
                      <Select.ItemGroup>
                        {seaStateCollection.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </FormField>

            <FormField
              label="Sail Configuration"
              error={errors.sailConfiguration?.message}
            >
              <Input
                {...register("sailConfiguration")}
                placeholder="e.g., Main + Genoa"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>
          </Grid>
        </Card>

        {/* Additional Notes */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Additional Notes
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Record any observations, highlights, or special moments from your
              sail
            </Box>
          </Box>

          <FormField label="Notes" error={errors.notes?.message}>
            <Textarea
              {...register("notes")}
              placeholder="Describe your sailing experience, crew, wildlife sightings, or any memorable moments..."
              rows={4}
              size="lg"
              bg="bg.subtle"
              _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              resize="vertical"
            />
          </FormField>
        </Card>

        {/* Action Buttons */}
        <Flex
          justifyContent={{ base: "stretch", sm: "flex-end" }}
          gap="4"
          pt="1"
        >
          <Button
            type="submit"
            variant="surface"
            colorPalette={isValid ? "green" : "gray"}
            loading={isLoading}
            disabled={!isValid}
            w={{ base: "full", sm: "auto" }}
            minW="140px"
          >
            {submitButtonText}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
};
