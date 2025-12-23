"use client";

import { Box, Text, Flex, Grid, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiSailingActivityWithBoat } from "@/types/api";
import { DateTime } from "luxon";
import { Card } from "@/components/card";
import {
  AreaChart,
  Area,
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

interface ChartDataPoint {
  date: string;
  displayDate: string;
  cumulativeHours: number;
  cumulativeDistance: number;
}

export function ActivityStatsCharts({ activities }: ActivityStatsChartsProps) {
  const chartData = useMemo(() => {
    // Sort activities by date
    const sortedActivities = [...activities].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const dataPoints: ChartDataPoint[] = [];

    // Group by month for cleaner visualization
    const monthlyData = new Map<
      string,
      { hours: number; distance: number; date: DateTime }
    >();

    for (const activity of sortedActivities) {
      const start = DateTime.fromISO(activity.startTime);
      const end = DateTime.fromISO(activity.endTime);
      const hours = end.diff(start, "hours").hours;
      const distance = activity.distanceNm || 0;

      const monthKey = start.toFormat("yyyy-MM");
      const existing = monthlyData.get(monthKey);

      if (existing) {
        existing.hours += hours;
        existing.distance += distance;
      } else {
        monthlyData.set(monthKey, {
          hours,
          distance,
          date: start.startOf("month"),
        });
      }
    }

    // Convert to per-month data points (not cumulative)
    const sortedMonths = Array.from(monthlyData.entries()).sort(
      ([a], [b]) => (a < b ? -1 : 1)
    );

    for (const [, data] of sortedMonths) {
      dataPoints.push({
        date: data.date.toISO()!,
        displayDate: data.date.toFormat("MMM"),
        cumulativeHours: Math.round(data.hours * 10) / 10,
        cumulativeDistance: Math.round(data.distance * 10) / 10,
      });
    }

    return dataPoints;
  }, [activities]);


  const formatNumber = (value: number) => {
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
  const hoursColor = "#3182CE"; // blue.500
  const distanceColor = "#38A169"; // green.500

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
          {payload.map((entry, index) => (
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
                {entry.dataKey === "cumulativeHours"
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
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="hoursGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={hoursColor}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={hoursColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chakra-colors-border-muted)"
                />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fill: "var(--chakra-colors-fg-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
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
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulativeHours"
                  name="Hours Sailed"
                  stroke={hoursColor}
                  strokeWidth={2}
                  fill="url(#hoursGradient)"
                />
              </AreaChart>
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
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="distanceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={distanceColor}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={distanceColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chakra-colors-border-muted)"
                />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fill: "var(--chakra-colors-fg-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
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
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulativeDistance"
                  name="Distance Sailed"
                  stroke={distanceColor}
                  strokeWidth={2}
                  fill="url(#distanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
}
