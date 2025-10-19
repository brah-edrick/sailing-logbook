import z from "zod";

export const boatSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["monohull", "trimaran", "catamaran"]).nullable(),
  make: z.string().min(1),
  model: z.string().min(1).nullable(),
  year: z.number().min(1).nullable(),
  lengthFt: z.number().min(1),
  beamFt: z.number().min(1).nullable(),
  sailNumber: z.string().min(1).nullable(),
  homePort: z.string().min(1).nullable(),
  owner: z.string().min(1).nullable(),
  notes: z.string().min(1).nullable(),
  colorHex: z.string().min(1).nullable(),
});
