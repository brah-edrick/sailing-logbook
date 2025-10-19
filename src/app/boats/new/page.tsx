"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Fieldset,
  Field,
  Input,
  Textarea,
  Flex,
  Heading,
  Box,
  Stack,
  Text,
  Grid,
  Link,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
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

type BoatFormProps = {
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
                  <Input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  />
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

export default function NewBoatPage() {
  const router = useRouter();
  const initialValues = {
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
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Network error while creating boat",
        type: "error",
      });
    }
  };

  return (
    <main>
      <Link href="/boats">
        <Text color="white">Back to Boats</Text>
      </Link>
      <Heading size="3xl" color="white" mb="6">
        Add a New Boat
      </Heading>
      <BoatForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitButtonText="Add Boat"
      />
    </main>
  );
}
