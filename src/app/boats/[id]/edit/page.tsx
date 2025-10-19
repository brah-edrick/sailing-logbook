"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heading, Text, Link, Spinner, Center } from "@chakra-ui/react";
import { BoatForm, BoatFormFields } from "../../new/page";
import { toaster } from "@/components/ui/toaster";

export default function EditBoatPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [boat, setBoat] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>("");

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };
        getParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchBoat = async () => {
            try {
                const res = await fetch(`/api/boats/${id}`);
                if (res.ok) {
                    const boatData = await res.json();
                    setBoat(boatData);
                } else {
                    toaster.create({
                        title: "Error",
                        description: "Failed to load boat data",
                        type: "error",
                    });
                    router.push("/boats");
                }
            } catch (error) {
                toaster.create({
                    title: "Error",
                    description: "Error loading boat data",
                    type: "error",
                });
                router.push("/boats");
            } finally {
                setLoading(false);
            }
        };

        fetchBoat();
    }, [id, router]);

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
            const res = await fetch(`/api/boats/${id}`, {
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
                router.push(`/boats/${id}`);
            } else {
                toaster.create({
                    title: "Error",
                    description: "Failed to update boat",
                    type: "error",
                });
            }
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Error updating boat",
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

    if (!boat) {
        return (
            <main>
                <Text color="white">Boat not found</Text>
            </main>
        );
    }

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
        <main>
            <Link href={`/boats/${id}`}>
                <Text color="white">Back to {boat.name}</Text>
            </Link>
            <Heading size="3xl" color="white" mb="6">
                Edit {boat.name}
            </Heading>
            <BoatForm
                onSubmit={handleSubmit}
                initialValues={initialValues}
                submitButtonText="Update Boat"
            />
        </main>
    );
}
