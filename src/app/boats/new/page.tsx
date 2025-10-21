"use client";

import { useRouter } from "next/navigation";
import { Heading, Text, Link } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { BoatFormFields, BoatForm } from "@/components/form/boat";

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
    } catch {
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
        <Text>Back to Boats</Text>
      </Link>
      <Heading size="3xl" mb="6">
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
