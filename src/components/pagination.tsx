"use client";

import { Button, Flex, Text, Group } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Update URL with new page
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const { page, totalPages } = meta;

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Show pages around current page
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    // Add ellipsis if there's a gap
    if (start > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <Flex justifyContent="space-between" alignItems="center" mt="4">
      <Text fontSize="sm" color="fg.muted">
        {`Showing ${(meta.page - 1) * meta.limit + 1} - ${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total} items`}
      </Text>

      <Flex alignItems="center" gap="4">
        <Button
          size="sm"
          colorPalette="green"
          variant={meta.hasPrevPage ? "surface" : "outline"}
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={!meta.hasPrevPage}
        >
          Previous
        </Button>
        <Group attached>
          {generatePageNumbers().map((pageNum, index) => (
            <Button
              key={index}
              size="sm"
              colorPalette={pageNum === meta.page ? "green" : "gray"}
              variant={pageNum === meta.page ? "surface" : "outline"}
              onClick={() =>
                typeof pageNum === "number" && handlePageChange(pageNum)
              }
              disabled={pageNum === "..."}
            >
              {pageNum}
            </Button>
          ))}
        </Group>
        <Button
          size="sm"
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={!meta.hasNextPage}
          colorPalette="green"
          variant={meta.hasNextPage ? "surface" : "outline"}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
}
