"use client";

import {
  Field,
  Stack,
  Box,
  Fieldset,
  Grid,
  Input,
  Textarea,
  Flex,
  Button,
  createListCollection,
  Portal,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { ApiBoat } from "@/types/api";

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

const typeCollection = createListCollection({
  items: [
    { label: "Monohull", value: "monohull" },
    { label: "Trimaran", value: "trimaran" },
    { label: "Catamaran", value: "catamaran" },
  ],
});

export type BoatFormFields = {
  name: string;
  type: string;
  make: string;
  model: string;
  year: string;
  lengthFt: string;
  beamFt: string;
  sailNumber: string;
  homePort: string;
  owner: string;
  notes: string;
  colorHex: string;
};

export type BoatFormProps = {
  onSubmit: (form: BoatFormFields) => void;
  initialValues: BoatFormFields;
  submitButtonText: string;
};

export const BoatForm: React.FC<BoatFormProps> = ({
  onSubmit,
  initialValues,
  submitButtonText,
}) => {
  const [form, setForm] = useState(initialValues);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" gap="4">
        <Box border="1px solid" borderColor="gray.800" borderRadius="md" p="4">
          <Fieldset.Root>
            <Fieldset.Legend>Required Information</Fieldset.Legend>
            <Fieldset.Content>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <FormField label="Name" required>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </FormField>
                <FormField label="Make" required>
                  <Input
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                    required
                  />
                </FormField>
                <FormField label="Length (ft)" required>
                  <Input
                    name="lengthFt"
                    value={form.lengthFt}
                    onChange={handleChange}
                    required
                    type="number"
                  />
                </FormField>
              </Grid>
            </Fieldset.Content>
          </Fieldset.Root>
        </Box>

        <Box border="1px solid" borderColor="gray.800" borderRadius="md" p="4">
          <Fieldset.Root>
            <Fieldset.Legend>Optional Information</Fieldset.Legend>
            <Fieldset.Content>
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <FormField label="Type">
                  <Select.Root
                    collection={typeCollection}
                    onValueChange={(details) =>
                      setForm({ ...form, type: details.value[0] })
                    }
                    value={form.type ? [form.type] : []}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Monohull, Trimaran, Catamaran" />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {typeCollection.items.map((type) => (
                            <Select.Item item={type} key={type.value}>
                              <Select.ItemText>{type.label}</Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </FormField>
                <FormField label="Model">
                  <Input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField label="Year">
                  <Input
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    type="number"
                  />
                </FormField>
                <FormField label="Beam (ft)">
                  <Input
                    name="beamFt"
                    value={form.beamFt}
                    onChange={handleChange}
                    type="number"
                  />
                </FormField>
                <FormField label="Sail Number">
                  <Input
                    name="sailNumber"
                    value={form.sailNumber}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField label="Home Port">
                  <Input
                    name="homePort"
                    value={form.homePort}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField label="Owner">
                  <Input
                    name="owner"
                    value={form.owner}
                    onChange={handleChange}
                  />
                </FormField>
                <FormField label="Color">
                  <Input
                    name="colorHex"
                    value={form.colorHex}
                    onChange={handleChange}
                    type="color"
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

// Edit Boat Form Component
interface EditBoatFormProps {
  boat: ApiBoat;
}

export function EditBoatForm({ boat }: EditBoatFormProps) {
  const router = useRouter();

  const handleSubmit = async (formData: BoatFormFields) => {
    const payload = {
      name: formData.name,
      type: formData.type || null,
      make: formData.make,
      model: formData.model || null,
      year: formData.year ? Number(formData.year) : null,
      lengthFt: Number(formData.lengthFt),
      beamFt: formData.beamFt ? Number(formData.beamFt) : null,
      sailNumber: formData.sailNumber || null,
      homePort: formData.homePort || null,
      owner: formData.owner || null,
      notes: formData.notes || null,
      colorHex: formData.colorHex || null,
    };

    try {
      const res = await fetch(`/api/boats/${boat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toaster.create({
          title: "Success",
          description: `${boat.name} updated successfully`,
          type: "success",
        });
        router.push(`/boats/${boat.id}`);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to update boat",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error updating boat",
        type: "error",
      });
    }
  };

  const initialValues: BoatFormFields = {
    name: boat.name || "",
    type: boat.type || "",
    make: boat.make || "",
    model: boat.model || "",
    year: boat.year?.toString() || "",
    lengthFt: boat.lengthFt?.toString() || "",
    beamFt: boat.beamFt?.toString() || "",
    sailNumber: boat.sailNumber || "",
    homePort: boat.homePort || "",
    owner: boat.owner || "",
    notes: boat.notes || "",
    colorHex: boat.colorHex || "#3b82f6",
  };

  return (
    <BoatForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitButtonText="Update Boat"
    />
  );
}

// New Boat Form Component
export function NewBoatForm() {
  const router = useRouter();

  const initialValues: BoatFormFields = {
    name: "",
    type: "",
    make: "",
    model: "",
    year: "",
    lengthFt: "",
    beamFt: "",
    sailNumber: "",
    homePort: "",
    owner: "",
    notes: "",
    colorHex: "#3b82f6",
  };

  const handleSubmit = async (boat: BoatFormFields) => {
    try {
      const payload = {
        name: boat.name,
        type: boat.type || null,
        make: boat.make,
        model: boat.model || null,
        year: boat.year ? Number(boat.year) : null,
        lengthFt: Number(boat.lengthFt),
        beamFt: boat.beamFt ? Number(boat.beamFt) : null,
        sailNumber: boat.sailNumber || null,
        homePort: boat.homePort || null,
        owner: boat.owner || null,
        notes: boat.notes || null,
        colorHex: boat.colorHex || null,
      };

      const res = await fetch("/api/boats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const boat = await res.json();
        toaster.create({
          title: "Success",
          description: `${boat.name} created successfully`,
          type: "success",
        });
        router.push(`/boats/${boat.id}`);
      } else {
        toaster.create({
          title: "Error",
          description: `Failed to create ${boat.name}, please try again`,
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Network error while creating boat",
        type: "error",
      });
    }
  };

  return (
    <BoatForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitButtonText="Add Boat"
    />
  );
}
