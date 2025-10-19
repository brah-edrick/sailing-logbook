/*
  Warnings:

  - You are about to drop the column `crew` on the `SailingActivity` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `SailingActivity` table. All the data in the column will be lost.
  - Made the column `endTime` on table `SailingActivity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `SailingActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SailingActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "boatId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "departureLocation" TEXT,
    "returnLocation" TEXT,
    "distanceNm" REAL,
    "avgSpeedKnots" REAL,
    "weatherConditions" TEXT,
    "windSpeedKnots" REAL,
    "windDirection" TEXT,
    "seaState" TEXT,
    "sailConfiguration" TEXT,
    "purpose" TEXT,
    "notes" TEXT,
    CONSTRAINT "SailingActivity_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "Boat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SailingActivity" ("avgSpeedKnots", "boatId", "departureLocation", "distanceNm", "endTime", "id", "notes", "purpose", "returnLocation", "sailConfiguration", "seaState", "startTime", "weatherConditions", "windDirection", "windSpeedKnots") SELECT "avgSpeedKnots", "boatId", "departureLocation", "distanceNm", "endTime", "id", "notes", "purpose", "returnLocation", "sailConfiguration", "seaState", "startTime", "weatherConditions", "windDirection", "windSpeedKnots" FROM "SailingActivity";
DROP TABLE "SailingActivity";
ALTER TABLE "new_SailingActivity" RENAME TO "SailingActivity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
