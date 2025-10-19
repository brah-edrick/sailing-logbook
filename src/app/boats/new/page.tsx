"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBoatPage() {
  const router = useRouter();
  const [form, setForm] = useState({
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      type: form.type || null,
      make: form.make,
      model: form.model || null,
      year: form.year ? Number(form.year) : null,
      lengthFt: Number(form.lengthFt),
      beamFt: form.beamFt ? Number(form.beamFt) : null,
      sailNumber: form.sailNumber || null,
      homePort: form.homePort || null,
      owner: form.owner || null,
      notes: form.notes || null,
      colorHex: form.colorHex || null,
    };

    const res = await fetch("/api/boats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const boat = await res.json();
      router.push(`/boats/${boat.id}`);
    } else {
      alert("Failed to create boat");
    }
  };

  return (
    <main>
      <h1>Add a New Boat</h1>
      <form onSubmit={handleSubmit}>
        {/* Required */}
        <div>
          <Input
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="make"
            label="Make"
            value={form.make}
            onChange={handleChange}
            required
          />
          <Input
            name="lengthFt"
            label="Length (ft)"
            value={form.lengthFt}
            onChange={handleChange}
            required
            type="number"
          />
        </div>

        {/* Optional */}
        <h2>Optional Fields</h2>
        <div>
          <Input
            name="type"
            label="Type"
            value={form.type}
            onChange={handleChange}
          />
          <Input
            name="model"
            label="Model"
            value={form.model}
            onChange={handleChange}
          />
          <Input
            name="year"
            label="Year"
            value={form.year}
            onChange={handleChange}
            type="number"
          />
          <Input
            name="beamFt"
            label="Beam (ft)"
            value={form.beamFt}
            onChange={handleChange}
            type="number"
          />
          <Input
            name="sailNumber"
            label="Sail Number"
            value={form.sailNumber}
            onChange={handleChange}
          />
          <Input
            name="homePort"
            label="Home Port"
            value={form.homePort}
            onChange={handleChange}
          />
          <Input
            name="owner"
            label="Owner"
            value={form.owner}
            onChange={handleChange}
          />
          <Input
            name="colorHex"
            label="Color"
            value={form.colorHex}
            onChange={handleChange}
            type="color"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit">
          Add Boat
        </button>
      </form>
    </main>
  );
}

// Helper input component
function Input({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
