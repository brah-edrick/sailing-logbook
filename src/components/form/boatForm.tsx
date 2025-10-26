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
  boatFormSchema,
  type BoatFormInput,
  type BoatType,
} from "@/validation/schemas";

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

const typeCollection = createListCollection({
  items: [
    { label: "Monohull", value: "monohull" },
    { label: "Trimaran", value: "trimaran" },
    { label: "Catamaran", value: "catamaran" },
    { label: "Racer", value: "racer" },
  ],
});

export type BoatFormProps = {
  onSubmit: (form: BoatFormInput) => void;
  initialValues: Partial<BoatFormInput>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const BoatForm: React.FC<BoatFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BoatFormInput>({
    resolver: zodResolver(boatFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: initialValues.name || "",
      type: initialValues.type || null,
      make: initialValues.make || "",
      model: initialValues.model || "",
      year:
        initialValues.year && initialValues.year !== ""
          ? initialValues.year
          : undefined,
      lengthFt: initialValues.lengthFt || "",
      beamFt: initialValues.beamFt || "",
      sailNumber: initialValues.sailNumber || "",
      homePort: initialValues.homePort || "",
      owner: initialValues.owner || "",
      notes: initialValues.notes || "",
      colorHex: initialValues.colorHex || "#3b82f6",
    },
  });

  const handleFormSubmit = (data: BoatFormInput) => {
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
            {submitButtonText.includes("Add") ? "Add New Boat" : "Edit Boat"}
          </Box>
          <Box color="fg.muted" fontSize="sm">
            {submitButtonText.includes("Add")
              ? "Enter the details for your new boat to start tracking sailing activities."
              : "Update your boat information to keep your sailing log accurate."}
          </Box>
        </Box>

        {/* Essential Information */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Essential Information
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Basic details required to identify your boat
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
            <FormField label="Boat Name" required error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="e.g., Sea Breeze"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField label="Make" required error={errors.make?.message}>
              <Input
                {...register("make")}
                placeholder="e.g., Beneteau"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField label="Model" error={errors.model?.message}>
              <Input
                {...register("model")}
                placeholder="e.g., Oceanis 40"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField label="Type" error={errors.type?.message}>
              <Select.Root
                collection={typeCollection}
                value={watch("type") ? [watch("type")!] : []}
                onValueChange={(details) =>
                  setValue(
                    "type",
                    (details.value[0] as BoatType | null) || null
                  )
                }
              >
                <Select.Trigger
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                >
                  <Select.ValueText placeholder="Select boat type" />
                  <Select.Indicator />
                </Select.Trigger>
                <Portal>
                  <Select.Positioner>
                    <Select.Content position="popper">
                      <Select.ItemGroup>
                        {typeCollection.items.map((item) => (
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
            <FormField label="Year" error={errors.year?.message}>
              <Input
                {...register("year")}
                type="number"
                placeholder="2020"
                min={1900}
                max={new Date().getFullYear() + 1}
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>

            <FormField label="Sail Number" error={errors.sailNumber?.message}>
              <Input
                {...register("sailNumber")}
                placeholder="e.g., USA12345"
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
              />
            </FormField>
          </Grid>
        </Card>

        {/* Dimensions & Specifications */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Dimensions & Specifications
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Physical measurements and technical details
            </Box>
          </Box>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: "4", md: "6" }}
          >
            <FormField label="Length" required error={errors.lengthFt?.message}>
              <NumberInput.Root
                value={watch("lengthFt") || ""}
                onValueChange={(details) =>
                  setValue("lengthFt", details.value.toString())
                }
                step={1}
                min={0}
                width="100%"
                formatOptions={{
                  style: "unit",
                  unit: "foot",
                  unitDisplay: "short",
                }}
              >
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input
                  placeholder="40.5 ft"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </NumberInput.Root>
            </FormField>

            <FormField label="Beam" error={errors.beamFt?.message}>
              <NumberInput.Root
                value={watch("beamFt") || ""}
                onValueChange={(details) =>
                  setValue("beamFt", details.value.toString())
                }
                step={1}
                min={0}
                width="100%"
                formatOptions={{
                  style: "unit",
                  unit: "foot",
                  unitDisplay: "short",
                }}
              >
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
                <NumberInput.Input
                  placeholder="13.2 ft"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </NumberInput.Root>
            </FormField>
          </Grid>
        </Card>

        {/* Additional Details */}
        <Card>
          <Box mb="6">
            <Box
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              mb="2"
              color="fg.emphasized"
            >
              Additional Details
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Optional information to complete your boat profile
            </Box>
          </Box>

          <Stack gap={{ base: "4", md: "6" }}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={{ base: "4", md: "6" }}
            >
              <FormField label="Home Port" error={errors.homePort?.message}>
                <Input
                  {...register("homePort")}
                  placeholder="e.g., Newport, RI"
                  size="md"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </FormField>

              <FormField label="Owner" error={errors.owner?.message}>
                <Input
                  {...register("owner")}
                  placeholder="Boat owner name"
                  size="md"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                />
              </FormField>
            </Grid>

            <FormField label="Boat Color" error={errors.colorHex?.message}>
              <Flex gap="4" align="center">
                <Input
                  {...register("colorHex")}
                  placeholder="#3B82F6"
                  type="color"
                  size="md"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                  w="120px"
                  h="48px"
                  p="2"
                />
                <Box color="fg.muted" fontSize="sm">
                  Choose a color to represent your boat
                </Box>
              </Flex>
            </FormField>

            <FormField label="Notes" error={errors.notes?.message}>
              <Textarea
                {...register("notes")}
                placeholder="Any additional notes about your boat, equipment, or special features..."
                rows={4}
                size="md"
                bg="bg.subtle"
                _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                resize="vertical"
              />
            </FormField>
          </Stack>
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
