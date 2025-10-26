"use client";

import { PaginatedTable } from "@/components/paginatedTable";
import { boatsColumns } from "@/components/tableColumns";
import { PaginatedBoatsResponse } from "@/types/api";
import { useRouter, useSearchParams } from "next/navigation";

interface BoatsTableProps {
  data: PaginatedBoatsResponse;
}

export function BoatsTable({ data }: BoatsTableProps) {
  const { data: boats, meta: paginationMeta } = data;
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
      data={boats}
      meta={paginationMeta}
      columns={boatsColumns}
      emptyStateMessage="No boats found. Add your first boat!"
      emptyStateAction={{
        label: "+ Add New Boat",
        href: "/boats/new",
      }}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
    />
  );
}
