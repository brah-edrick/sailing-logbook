import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Boats CRUD", () => {
  let boatId: number;

  beforeAll(async () => {
    await prisma.sailingActivity.deleteMany();
    await prisma.boat.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("Create a boat", async () => {
    const boat = await prisma.boat.create({
      data: {
        name: "Test Boat",
        type: "monohull",
        make: "Test Make",
        model: "Test Model",
        year: 2020,
        lengthFt: 40,
      },
    });

    expect(boat).toHaveProperty("id");
    expect(boat.name).toBe("Test Boat");

    boatId = boat.id;
  });

  test("Read a boat", async () => {
    const boat = await prisma.boat.findUnique({
      where: { id: boatId },
    });

    expect(boat).not.toBeNull();
    if (boat) {
      expect(boat.name).toBe("Test Boat");
    }
  });

  test("Update a boat", async () => {
    const updated = await prisma.boat.update({
      where: { id: boatId },
      data: { name: "Updated Boat Name" },
    });

    expect(updated.name).toBe("Updated Boat Name");
  });

  test("Delete a boat", async () => {
    await prisma.boat.delete({
      where: { id: boatId },
    });

    const deleted = await prisma.boat.findUnique({
      where: { id: boatId },
    });

    expect(deleted).toBeNull();
  });
});
