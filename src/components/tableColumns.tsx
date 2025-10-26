import Link from "next/link";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Column } from "@/components/paginatedTable";
import { ApiSailingActivityWithBoat, ApiBoat } from "@/types/api";
import {
  formatDate,
  calculateDuration,
  formatDisplayValue,
  getFieldUnit,
} from "@/utils/date";

export const activitiesColumns: Column<ApiSailingActivityWithBoat>[] = [
  {
    field: "startTime",
    label: "Date",
    render: (value) => <Text>{formatDate(value as string)}</Text>,
    sortable: true,
  },
  {
    field: "boat",
    label: "Boat",
    render: (boat, activity) => {
      const boatData = boat as ApiBoat | null;
      return (
        <Link href={`/boats/${activity.boatId}`}>
          <Flex alignItems="center" gap="2">
            {boatData?.colorHex && (
              <Box
                style={{ backgroundColor: boatData.colorHex }}
                borderRadius="full"
                boxSize="12px"
              />
            )}
            <Text>{boatData?.name || "Unknown Boat"}</Text>
          </Flex>
        </Link>
      );
    },
  },
  {
    field: "endTime",
    label: "Duration",
    render: (_, activity) => (
      <Text>{calculateDuration(activity.startTime, activity.endTime)}</Text>
    ),
  },
  {
    field: "purpose",
    label: "Purpose",
    render: (value) => (
      <Text>
        {value
          ? (value as string).charAt(0).toUpperCase() +
            (value as string).slice(1)
          : "-"}
      </Text>
    ),
  },
  {
    field: "distanceNm",
    label: "Distance",
    render: (value) => (
      <Text>
        {value
          ? `${formatDisplayValue((value as number).toString(), "distanceNm")} ${getFieldUnit("distanceNm")}`
          : "-"}
      </Text>
    ),
  },
  {
    field: "id",
    label: "",
    render: (id) => (
      <Flex gap="2" justifyContent="end">
        <Button size="sm" variant="outline" colorPalette="orange" asChild>
          <Link href={`/activities/${id}/edit`}>Edit</Link>
        </Button>
        <Button size="sm" variant="surface" colorPalette="blue" asChild>
          <Link href={`/activities/${id}`}>View</Link>
        </Button>
      </Flex>
    ),
  },
];

export const boatsColumns: Column<ApiBoat>[] = [
  {
    field: "name",
    label: "Name",
    render: (name, boat) => (
      <Flex alignItems="center" gap="2">
        <Box
          style={{ backgroundColor: boat.colorHex || "#FFFFFF" }}
          borderRadius="full"
          boxSize="12px"
        />
        <Text>{name as string}</Text>
      </Flex>
    ),
    sortable: true,
  },
  {
    field: "make",
    label: "Make",
    render: (value) => <Text>{(value as string) || "-"}</Text>,
  },
  {
    field: "model",
    label: "Model",
    render: (value) => <Text>{(value as string) || "-"}</Text>,
  },
  {
    field: "year",
    label: "Year",
    render: (value) => <Text>{(value as string) || "-"}</Text>,
  },
  {
    field: "lengthFt",
    label: "Length",
    render: (value) => (
      <Text>
        {value
          ? `${formatDisplayValue((value as number).toString(), "lengthFt")} ${getFieldUnit("lengthFt")}`
          : "-"}
      </Text>
    ),
  },
  {
    field: "id",
    label: "",
    render: (id) => (
      <Flex gap="2" justifyContent="end">
        <Button size="sm" variant="outline" colorPalette="orange" asChild>
          <Link href={`/boats/${id}/edit`}>Edit</Link>
        </Button>
        <Button size="sm" variant="surface" colorPalette="blue" asChild>
          <Link href={`/boats/${id}`}>View</Link>
        </Button>
      </Flex>
    ),
  },
];

export const boatActivitiesColumns: Column<ApiSailingActivityWithBoat>[] = [
  {
    field: "startTime",
    label: "Date",
    render: (value) => <Text>{formatDate(value as string)}</Text>,
    sortable: true,
  },
  {
    field: "endTime",
    label: "Duration",
    render: (_, activity) => (
      <Text>{calculateDuration(activity.startTime, activity.endTime)}</Text>
    ),
  },
  {
    field: "distanceNm",
    label: "Distance",
    render: (value) => (
      <Text>
        {value
          ? `${formatDisplayValue((value as number).toString(), "distanceNm")} ${getFieldUnit("distanceNm")}`
          : "-"}
      </Text>
    ),
  },
  {
    field: "purpose",
    label: "Purpose",
    render: (value) => (
      <Text>
        {value
          ? (value as string).charAt(0).toUpperCase() +
            (value as string).slice(1)
          : "-"}
      </Text>
    ),
  },
  {
    field: "id",
    label: "",
    render: (id) => (
      <Flex gap="2" justifyContent="end">
        <Button size="sm" variant="outline" colorPalette="orange" asChild>
          <Link href={`/activities/${id}/edit`}>Edit</Link>
        </Button>
        <Button size="sm" variant="surface" colorPalette="blue" asChild>
          <Link href={`/activities/${id}`}>View</Link>
        </Button>
      </Flex>
    ),
  },
];
