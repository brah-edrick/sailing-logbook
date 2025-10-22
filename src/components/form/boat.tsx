"use client";

import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { ApiBoat } from "@/types/api";
import { BoatForm } from "./boatForm";
import { type BoatFormInput, type BoatType } from "@/validation/schemas";

// Edit Boat Form Component
export function EditBoatForm({ boat }: { boat: ApiBoat }) {
  const router = useRouter();

  const initialValues: Partial<BoatFormInput> = {
    name: boat.name,
    type: boat.type as BoatType | null,
    make: boat.make,
    model: boat.model || "",
    year: boat.year?.toString() || "",
    lengthFt: boat.lengthFt.toString(),
    beamFt: boat.beamFt?.toString() || "",
    sailNumber: boat.sailNumber || "",
    homePort: boat.homePort || "",
    owner: boat.owner || "",
    notes: boat.notes || "",
    colorHex: boat.colorHex || "#3b82f6",
  };

  const handleSubmit = async (formData: BoatFormInput) => {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
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
          description: `Failed to update ${boat.name}, please try again`,
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Network error while updating boat",
        type: "error",
      });
    }
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

  const initialValues: Partial<BoatFormInput> = {
    name: "",
    type: null,
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

  const handleSubmit = async (formData: BoatFormInput) => {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
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
          description: `Failed to create boat, please try again`,
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
