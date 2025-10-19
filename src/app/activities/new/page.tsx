"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Fieldset, Field, Input, Textarea, Flex, Heading, Box, Stack, Text, Grid, Link, Select, Spinner, Center, Portal, createListCollection } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Boat } from "@prisma/client";

interface FormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, required = false, children }) => {
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
}

type ActivityFormProps = {
    onSubmit: (form: ActivityFormFields) => void;
    initialValues: ActivityFormFields;
    submitButtonText: string;
    boats: Boat[];
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, initialValues, submitButtonText, boats }) => {
    const [form, setForm] = useState(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        }))
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
                                        onValueChange={(details) => setForm({ ...form, boatId: details.value[0] })}
                                        value={form.boatId ? [form.boatId] : []}
                                    >
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Flex alignItems="center" gap="2">
                                                    <Box style={{ backgroundColor: form.boatId ? boatsCollection.items.find((boat) => boat.value === form.boatId)?.colorHex || "white" : "white" }}
                                                        borderRadius="full"
                                                        boxSize="12px" />
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
                                                                    <Box style={{ backgroundColor: boat.colorHex || "white" }}
                                                                        borderRadius="full"
                                                                        boxSize="12px" />
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
                                    <Input
                                        name="purpose"
                                        value={form.purpose}
                                        onChange={handleChange}
                                        placeholder="Racing, Cruising, Training, etc."
                                    />
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
                                    <Input
                                        name="weatherConditions"
                                        value={form.weatherConditions}
                                        onChange={handleChange}
                                        placeholder="Sunny, Cloudy, Rainy, etc."
                                    />
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
                                    <Input
                                        name="windDirection"
                                        value={form.windDirection}
                                        onChange={handleChange}
                                        placeholder="N, NE, E, SE, S, SW, W, NW"
                                    />
                                </FormField>
                                <FormField label="Sea State">
                                    <Input
                                        name="seaState"
                                        value={form.seaState}
                                        onChange={handleChange}
                                        placeholder="Calm, Slight, Moderate, Rough"
                                    />
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
    )

}

export default function NewActivityPage() {
    const router = useRouter();
    const [boats, setBoats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const boatIdFromParams = searchParams.get("boatId");

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

    useEffect(() => {
        const fetchBoats = async () => {
            try {
                const res = await fetch("/api/boats");
                if (res.ok) {
                    const boatsData = await res.json();
                    setBoats(boatsData);
                }
            } catch (error) {
                console.error("Error fetching boats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoats();
    }, []);

    const handleSubmit = async (activity: ActivityFormFields) => {
        try {
            const payload = {
                boatId: Number(activity.boatId),
                startTime: new Date(activity.startTime).toISOString(),
                endTime: new Date(activity.endTime).toISOString(),
                departureLocation: activity.departureLocation || null,
                returnLocation: activity.returnLocation || null,
                distanceNm: activity.distanceNm ? Number(activity.distanceNm) : null,
                avgSpeedKnots: activity.avgSpeedKnots ? Number(activity.avgSpeedKnots) : null,
                weatherConditions: activity.weatherConditions || null,
                windSpeedKnots: activity.windSpeedKnots ? Number(activity.windSpeedKnots) : null,
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
                const activity = await res.json();
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
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Network error while creating activity",
                type: "error",
            });
        }
    };

    if (loading) {
        return (
            <main>
                <Center h="50vh">
                    <Spinner size="xl" color="white" />
                </Center>
            </main>
        );
    }

    return (
        <main>
            <Link href="/activities">
                <Text color="white">Back to Activities</Text>
            </Link>
            <Heading size="3xl" color="white" mb="6">Add New Activity</Heading>
            <ActivityForm onSubmit={handleSubmit} initialValues={initialValues} submitButtonText="Add Activity" boats={boats} />
        </main>
    );
}
