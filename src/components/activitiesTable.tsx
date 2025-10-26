"use client";

import { PaginatedTable } from "@/components/paginatedTable";
import { activitiesColumns } from "@/components/tableColumns";
import { PaginatedActivitiesResponse } from "@/types/api";
import { useRouter, useSearchParams } from "next/navigation";

interface ActivitiesTableProps {
  data: PaginatedActivitiesResponse;
}

export function ActivitiesTable({ data }: ActivitiesTableProps) {
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
      columns={activitiesColumns}
      emptyStateMessage="No activities found. Log your first sailing adventure!"
      emptyStateAction={{
        label: "+ Log New Activity",
        href: "/activities/new",
      }}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
    />
  );
}
