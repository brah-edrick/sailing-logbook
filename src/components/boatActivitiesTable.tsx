"use client";

import { PaginatedTable } from "@/components/paginatedTable";
import { boatActivitiesColumns } from "@/components/tableColumns";
import { PaginatedBoatActivitiesResponse } from "@/types/api";
import { useRouter, useSearchParams } from "next/navigation";

interface BoatActivitiesTableProps {
  data: PaginatedBoatActivitiesResponse;
  boatId: string;
}

export function BoatActivitiesTable({
  data,
  boatId,
}: BoatActivitiesTableProps) {
  const { data: activities, meta: paginationMeta } = data;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", page.toString());
    const query = current.toString();
    router.push(`?${query}`);
  };

  const handleLimitChange = (limit: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("limit", limit.toString());
    current.set("page", "1"); // Reset to first page when limit changes
    const query = current.toString();
    router.push(`?${query}`);
  };

  return (
    <PaginatedTable
      data={activities}
      meta={paginationMeta}
      columns={boatActivitiesColumns}
      emptyStateMessage="No activities found for this boat. Log your first sailing adventure!"
      emptyStateAction={{
        label: "+ Log New Activity",
        href: `/activities/new?boatId=${boatId}`,
      }}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
    />
  );
}
