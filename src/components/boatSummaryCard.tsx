import { Box, Grid, Text } from "@chakra-ui/react";
import { ApiBoatReport } from "@/types/api";
import { Card } from "@/components/card";

interface BoatSummaryCardProps {
  report: ApiBoatReport;
}

export function BoatSummaryCard({ report }: BoatSummaryCardProps) {
  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${Math.round(hours)}h`;
  };

  const formatDistance = (miles: number) => {
    return `${Math.round(miles * 10) / 10} NM`;
  };

  return (
    <Card>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="6">
        <Box textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" color="blue.600">
            {formatHours(report.total.hoursSailed)}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Hours Sailed
          </Text>
        </Box>

        <Box textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" color="green.600">
            {formatDistance(report.total.nauticalMiles)}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Nautical Miles
          </Text>
        </Box>

        <Box textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" color="purple.600">
            {report.total.eventCount}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Activities
          </Text>
        </Box>
      </Grid>
    </Card>
  );
}
