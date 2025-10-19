-- CreateTable
CREATE TABLE "Boat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "make" TEXT NOT NULL,
    "model" TEXT,
    "year" INTEGER,
    "lengthFt" REAL NOT NULL,
    "beamFt" REAL,
    "sailNumber" TEXT,
    "homePort" TEXT,
    "owner" TEXT,
    "notes" TEXT,
    "colorHex" TEXT
);

-- CreateTable
CREATE TABLE "SailingActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "boatId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "departureLocation" TEXT,
    "returnLocation" TEXT,
    "distanceNm" REAL,
    "avgSpeedKnots" REAL,
    "crew" TEXT,
    "weatherConditions" TEXT,
    "windSpeedKnots" REAL,
    "windDirection" TEXT,
    "seaState" TEXT,
    "sailConfiguration" TEXT,
    "purpose" TEXT,
    "notes" TEXT,
    CONSTRAINT "SailingActivity_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
