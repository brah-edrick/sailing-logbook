"use client";

import { useRouter } from "next/navigation";
import { BoatForm, BoatFormFields } from "@/components/form/boat";
import { toaster } from "@/components/ui/toaster";
import { ApiBoat } from "@/types/api";

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
