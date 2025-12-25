"use client";

import { Box, Text, Flex, Grid, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiSailingActivityWithBoat } from "@/types/api";
import { DateTime } from "luxon";
import { Card } from "@/components/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

interface ActivityStatsChartsProps {
  activities: ApiSailingActivityWithBoat[];
}

interface BoatData {
  id: number;
  name: string;
  color: string;
}

export function ActivityStatsCharts({ activities }: ActivityStatsChartsProps) {
  const { chartData, boats } = useMemo(() => {
    // Get unique boats
    const boatsMap = new Map<number, BoatData>();
    
    for (const activity of activities) {
      if (activity.boat && !boatsMap.has(activity.boat.id)) {
        boatsMap.set(activity.boat.id, {
          id: activity.boat.id,
          name: activity.boat.name,
          color: activity.boat.colorHex || "#6b7280",
        });
      }
    }

    const boatsList = Array.from(boatsMap.values());

    // Group by month and boat
    const monthlyData = new Map<
      string,
      { date: DateTime; boats: Map<number, { hours: number; distance: number }> }
    >();

    for (const activity of activities) {
      const start = DateTime.fromISO(activity.startTime);
      const end = DateTime.fromISO(activity.endTime);
      const hours = end.diff(start, "hours").hours;
      const distance = activity.distanceNm || 0;
      const boatId = activity.boat?.id || 0;

      const monthKey = start.toFormat("yyyy-MM");
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          date: start.startOf("month"),
          boats: new Map(),
        });
      }

      const monthData = monthlyData.get(monthKey)!;
      const boatData = monthData.boats.get(boatId) || { hours: 0, distance: 0 };
      boatData.hours += hours;
      boatData.distance += distance;
      monthData.boats.set(boatId, boatData);
    }

    // Generate data points for the last 12 months
    const dataPoints: Array<Record<string, string | number>> = [];
    const today = DateTime.now();
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = today.minus({ months: i }).startOf("month");
      const monthKey = monthDate.toFormat("yyyy-MM");
      const monthData = monthlyData.get(monthKey);

      const point: Record<string, string | number> = {
        date: monthDate.toISO()!,
        displayDate: monthDate.toFormat("MMM"),
      };

      // Add data for each boat
      for (const boat of boatsList) {
        const boatData = monthData?.boats.get(boat.id);
        point[`hours_${boat.id}`] = boatData ? Math.round(boatData.hours * 10) / 10 : 0;
        point[`distance_${boat.id}`] = boatData ? Math.round(boatData.distance * 10) / 10 : 0;
      }

      dataPoints.push(point);
    }

    return { chartData: dataPoints, boats: boatsList };
  }, [activities]);


  const formatNumber = (value: number) => {
    if (value === 0) return "";
    return Math.round(value).toString();
  };

  const formatHoursTooltip = (value: number) => {
    if (value < 1) {
      return `${Math.round(value * 60)}m`;
    }
    return `${Math.round(value)}h`;
  };

  const formatDistanceTooltip = (value: number) => {
    return `${Math.round(value)} NM`;
  };

  // Colors that match the app's design
  // (Now using boat colors directly from the data)

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ 
      value: number; 
      dataKey: string; 
      color: string;
      name: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      // Filter out entries with 0 values
      const nonZeroPayload = payload.filter(entry => entry.value > 0);
      
      if (nonZeroPayload.length === 0) return null;
      
      return (
        <Box
          bg="bg.panel"
          border="1px solid"
          borderColor="border.muted"
          borderRadius="md"
          shadow="lg"
          p="3"
        >
          <Text fontWeight="semibold" fontSize="sm" mb="1">
            {label}
          </Text>
          {nonZeroPayload.map((entry, index) => (
            <Flex key={index} justify="space-between" gap="4" fontSize="xs">
              <Flex align="center" gap="2">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={entry.color}
                />
                <Text color="fg.muted">{entry.name}</Text>
              </Flex>
              <Text fontWeight="medium">
                {entry.dataKey.startsWith("hours_")
                  ? formatHoursTooltip(entry.value)
                  : formatDistanceTooltip(entry.value)}
              </Text>
            </Flex>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <Text color="fg.muted" textAlign="center">
          No activity data available for charts
        </Text>
      </Card>
    );
  }

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4">
      {/* Hours Chart */}
      <Card>
        <Stack gap="3">
          <Text fontWeight="semibold" fontSize="md">
            Hours Sailed
          </Text>
          <Box h="180px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chakra-colors-border-muted)"
                />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 8, fill: "var(--chakra-colors-fg-muted)", dx: -5 }}
                  angle={-90}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={60}
                />
                <YAxis
                  tickFormatter={formatNumber}
                  tick={{ fontSize: 10, fill: "var(--chakra-colors-fg-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                >
                  <Label
                    value="Hours (hrs)"
                    angle={-90}
                    position="insideLeft"
                    style={{
                      textAnchor: "middle",
                      fill: "var(--chakra-colors-fg-muted)",
                      fontSize: 11,
                    }}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} cursor={false} />
                {boats.map((boat) => (
                  <Bar
                    key={boat.id}
                    dataKey={`hours_${boat.id}`}
                    name={boat.name}
                    stackId="hours"
                    fill={boat.color}
                    cursor="default"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Card>

      {/* Distance Chart */}
      <Card>
        <Stack gap="3">
          <Text fontWeight="semibold" fontSize="md">
            Distance Sailed
          </Text>
          <Box h="180px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chakra-colors-border-muted)"
                />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 8, fill: "var(--chakra-colors-fg-muted)", dx: -5 }}
                  angle={-90}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={60}
                />
                <YAxis
                  tickFormatter={formatNumber}
                  tick={{ fontSize: 10, fill: "var(--chakra-colors-fg-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                >
                  <Label
                    value="Distance (NM)"
                    angle={-90}
                    position="insideLeft"
                    style={{
                      textAnchor: "middle",
                      fill: "var(--chakra-colors-fg-muted)",
                      fontSize: 11,
                    }}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} cursor={false} />
                {boats.map((boat) => (
                  <Bar
                    key={boat.id}
                    dataKey={`distance_${boat.id}`}
                    name={boat.name}
                    stackId="distance"
                    fill={boat.color}
                    cursor="default"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
}
