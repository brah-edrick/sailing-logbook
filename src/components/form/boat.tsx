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
} from "@chakra-ui/react";
import React, { useState } from "react";

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
