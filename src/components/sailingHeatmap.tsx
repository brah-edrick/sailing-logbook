"use client";

import { Box, Text, Flex, Stack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { ApiSailingActivityWithBoat } from "@/types/api";
import { DateTime } from "luxon";
import { Card } from "@/components/card";
import { Portal } from "@chakra-ui/react";

interface SailingHeatmapProps {
  activities: ApiSailingActivityWithBoat[];
}

interface DayData {
  date: string;
  activities: ApiSailingActivityWithBoat[];
  totalDistance: number;
  boats: { id: number; name: string; colorHex: string | null }[];
}

interface HeatmapPopoverProps {
  data: DayData;
  position: { x: number; y: number };
}

function HeatmapPopover({ data, position }: HeatmapPopoverProps) {
  const formattedDate = DateTime.fromISO(data.date).toFormat("MMMM d, yyyy");

  return (
    <Portal>
      <Box
        position="fixed"
        left={`${position.x}px`}
        top={`${position.y - 10}px`}
        transform="translate(-50%, -100%)"
        bg="bg.panel"
        border="1px solid"
        borderColor="border.muted"
        borderRadius="lg"
        shadow="lg"
        p="3"
        zIndex="popover"
        minW="200px"
        maxW="300px"
      >
        <Text fontWeight="bold" fontSize="sm" mb="2">
          {formattedDate}
        </Text>
        <Stack gap="1">
          {data.activities.map((activity) => (
            <Flex key={activity.id} justify="space-between" fontSize="xs">
              <Flex align="center" gap="2">
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={activity.boat?.colorHex || "#6b7280"}
                />
                <Text>{activity.boat?.name || "Unknown"}</Text>
              </Flex>
              <Text color="fg.muted">
                {activity.distanceNm
                  ? `${activity.distanceNm.toFixed(1)} NM`
                  : "—"}
              </Text>
            </Flex>
          ))}
        </Stack>
        <Box
          position="absolute"
          bottom="-6px"
          left="50%"
          transform="translateX(-50%)"
          w="0"
          h="0"
          borderLeft="6px solid transparent"
          borderRight="6px solid transparent"
          borderTop="6px solid"
          borderTopColor="border.muted"
        />
      </Box>
    </Portal>
  );
}

function DayCell({
  data,
  maxDistance,
  onHover,
  onLeave,
}: {
  data: DayData | null;
  maxDistance: number;
  onHover: (data: DayData, e: React.MouseEvent) => void;
  onLeave: () => void;
}) {
  if (!data) {
    // Empty cell for padding
    return (
      <Box
        w="12px"
        h="12px"
        borderRadius="sm"
        bg="transparent"
        visibility="hidden"
      />
    );
  }

  const hasActivities = data.activities.length > 0;

  // Calculate opacity based on distance (min 0.3, max 1.0)
  const opacity = hasActivities
    ? Math.max(0.3, Math.min(1, data.totalDistance / (maxDistance || 1)))
    : 0;

  // Generate background style based on boat colors
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!hasActivities) {
      return { backgroundColor: "var(--chakra-colors-bg-subtle)" };
    }

    const colors = data.boats.map((b) => b.colorHex || "#6b7280");

    if (colors.length === 1) {
      return {
        backgroundColor: colors[0],
        opacity,
      };
    }

    // Create horizontal bars stacked vertically for multiple boats
    const stripeWidth = 100 / colors.length;
    const gradientStops = colors
      .map((color, i) => {
        const start = i * stripeWidth;
        const end = (i + 1) * stripeWidth;
        return `${color} ${start}%, ${color} ${end}%`;
      })
      .join(", ");

    return {
      background: `linear-gradient(180deg, ${gradientStops})`,
      backgroundOrigin: "border-box",
      opacity,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hasActivities) {
      onHover(data, e);
    }
  };

  return (
    <Box
      w="12px"
      h="12px"
      borderRadius="sm"
      style={getBackgroundStyle()}
      bg={!hasActivities ? "bg.subtle" : undefined}
      border="1px solid"
      borderColor={hasActivities ? "transparent" : "border.muted"}
      cursor={hasActivities ? "pointer" : "default"}
      transition="transform 0.1s ease"
      _hover={hasActivities ? { transform: "scale(1.2)" } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    />
  );
}

export function SailingHeatmap({ activities }: SailingHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    data: DayData;
    position: { x: number; y: number };
  } | null>(null);

  // Process activities into a map by date
  const { weeks, maxDistance, monthLabels } = useMemo(() => {
    const dataMap = new Map<string, DayData>();

    // Calculate exactly 52 weeks ending today
    const today = DateTime.now().startOf("day");
    const endOfWeek = today.endOf("week"); // End on Sunday
    const startDate = endOfWeek.minus({ weeks: 52 }).plus({ days: 1 }).startOf("week"); // Start on Monday 52 weeks ago

    // Group activities by date
    for (const activity of activities) {
      const activityDate = DateTime.fromISO(activity.startTime).toISODate();
      if (!activityDate) continue;

      const existing = dataMap.get(activityDate);
      const boat = activity.boat || {
        id: activity.boatId,
        name: "Unknown",
        colorHex: null,
      };

      if (existing) {
        existing.activities.push(activity);
        existing.totalDistance += activity.distanceNm || 0;
        if (!existing.boats.find((b) => b.id === boat.id)) {
          existing.boats.push(boat);
        }
      } else {
        dataMap.set(activityDate, {
          date: activityDate,
          activities: [activity],
          totalDistance: activity.distanceNm || 0,
          boats: [boat],
        });
      }
    }

    // Calculate max distance for opacity scaling
    let maxDist = 0;
    for (const data of dataMap.values()) {
      maxDist = Math.max(maxDist, data.totalDistance);
    }

    // Generate weeks array (each week is an array of 7 days)
    const weeksArr: (DayData | null)[][] = [];
    const monthLabelsArr: { label: string; weekIndex: number }[] = [];
    let currentDate = startDate;
    let currentWeek: (DayData | null)[] = [];
    let lastMonth = -1;

    // Iterate for exactly 52 weeks (364 days)
    const endDate = startDate.plus({ weeks: 52 }).minus({ days: 1 });

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISODate();

      // Track month changes for labels
      if (currentDate.month !== lastMonth) {
        monthLabelsArr.push({
          label: currentDate.toFormat("MMM"),
          weekIndex: weeksArr.length,
        });
        lastMonth = currentDate.month;
      }

      if (currentDate > today) {
        currentWeek.push(null);
      } else {
        const dayData = dataMap.get(dateStr!) || {
          date: dateStr!,
          activities: [],
          totalDistance: 0,
          boats: [],
        };
        currentWeek.push(dayData);
      }

      if (currentDate.weekday === 7) {
        // Sunday in Luxon
        weeksArr.push(currentWeek);
        currentWeek = [];
      }

      currentDate = currentDate.plus({ days: 1 });
    }

    // Push any remaining days (shouldn't happen with exact 52 weeks, but just in case)
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArr.push(currentWeek);
    }

    // Ensure exactly 52 weeks
    const finalWeeks = weeksArr.slice(-52);

    return {
      weeks: finalWeeks,
      maxDistance: maxDist,
      monthLabels: monthLabelsArr.slice(-12),
    };
  }, [activities]);

  const handleHover = (data: DayData, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setHoveredDay({
      data,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top,
      },
    });
  };

  const handleLeave = () => {
    setHoveredDay(null);
  };

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

  return (
    <Card>
      <Stack gap="3">
        <Text fontWeight="semibold" fontSize="md">
          Sailing Activity
        </Text>
        <Box pb="2">
          <Flex gap="1">
            {/* Day labels */}
            <Stack gap="1" mr="2" pt="20px">
              {dayLabels.map((label, i) => (
                <Text
                  key={i}
                  fontSize="xs"
                  color="fg.muted"
                  h="12px"
                  lineHeight="12px"
                >
                  {label}
                </Text>
              ))}
            </Stack>

            {/* Weeks container */}
            <Box overflowX="auto" maxW="100%">
              {/* Month labels */}
              <Flex h="16px" mb="1" position="relative">
                {monthLabels.map((monthLabel, i) => (
                  <Text
                    key={i}
                    fontSize="xs"
                    color="fg.muted"
                    position="absolute"
                    left={`${monthLabel.weekIndex * 14}px`}
                  >
                    {monthLabel.label}
                  </Text>
                ))}
              </Flex>

              {/* Heatmap grid */}
              <Flex gap="2px">
                {weeks.map((week, weekIndex) => (
                  <Stack key={weekIndex} gap="2px">
                    {week.map((day, dayIndex) => (
                      <DayCell
                        key={dayIndex}
                        data={day}
                        maxDistance={maxDistance}
                        onHover={handleHover}
                        onLeave={handleLeave}
                      />
                    ))}
                  </Stack>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Legend */}
        <Flex justify="flex-end" align="center" gap="2">
          <Text fontSize="xs" color="fg.muted">
            Less
          </Text>
          <Flex gap="1">
            <Box
              w="12px"
              h="12px"
              borderRadius="sm"
              bg="bg.subtle"
              border="1px solid"
              borderColor="border.muted"
            />
            <Box
              w="12px"
              h="12px"
              borderRadius="sm"
              bg="blue.500"
              opacity={0.3}
            />
            <Box
              w="12px"
              h="12px"
              borderRadius="sm"
              bg="blue.500"
              opacity={0.5}
            />
            <Box
              w="12px"
              h="12px"
              borderRadius="sm"
              bg="blue.500"
              opacity={0.75}
            />
            <Box w="12px" h="12px" borderRadius="sm" bg="blue.500" opacity={1} />
          </Flex>
          <Text fontSize="xs" color="fg.muted">
            More
          </Text>
        </Flex>
      </Stack>

      {hoveredDay && (
        <HeatmapPopover data={hoveredDay.data} position={hoveredDay.position} />
      )}
    </Card>
  );
}
