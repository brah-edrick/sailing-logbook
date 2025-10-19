import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Sailing Activities CRUD", () => {
  let boatId: number;
  let activityId: number;

  beforeAll(async () => {
    await prisma.sailingActivity.deleteMany();
    await prisma.boat.deleteMany();

    const boat = await prisma.boat.create({
      data: {
        name: "Activity Test Boat",
        type: "monohull",
        make: "Make X",
        year: 2010,
        lengthFt: 35,
      },
    });

    boatId = boat.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("Create an activity", async () => {
    const activity = await prisma.sailingActivity.create({
      data: {
        boatId,
        startTime: new Date("2025-08-01T10:00:00Z"),
        endTime: new Date("2025-08-01T12:00:00Z"),
        distanceNm: 15.5,
      },
    });

    expect(activity).toHaveProperty("id");
    expect(activity.boatId).toBe(boatId);

    activityId = activity.id;
  });

  test("Read an activity", async () => {
    const activity = await prisma.sailingActivity.findUnique({
      where: { id: activityId },
    });

    expect(activity).not.toBeNull();
    if (activity) {
      expect(activity.distanceNm).toBe(15.5);
    }
  });

  test("Update an activity", async () => {
    const updated = await prisma.sailingActivity.update({
      where: { id: activityId },
      data: { seaState: "Big ol waves" },
    });

    expect(updated.seaState).toBe("Big ol waves");
  });

  test("Delete an activity", async () => {
    await prisma.sailingActivity.delete({
      where: { id: activityId },
    });

    const deleted = await prisma.sailingActivity.findUnique({
      where: { id: activityId },
    });

    expect(deleted).toBeNull();
  });
});
