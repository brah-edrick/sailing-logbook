"use client";

import Link from "next/link";
import { Box, Button, Text, Table, Spinner } from "@chakra-ui/react";
import { PaginationMeta } from "@/types/api";
import { Pagination } from "@/components/pagination";
import { Card } from "@/components/card";
import { AuthGuard } from "@/components/authGuard";

interface Column<T> {
  field: keyof T;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface PaginatedTableProps<T> {
  data: T[];
  meta: PaginationMeta;
  columns: Column<T>[];
  emptyStateMessage: string;
  emptyStateAction?: {
    label: string;
    href: string;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSort?: (field: keyof T, order: "asc" | "desc") => void;
  loading?: boolean;
  className?: string;
}

export function PaginatedTable<T>({
  data,
  meta,
  columns,
  emptyStateMessage,
  emptyStateAction,
  onPageChange,
  onLimitChange,
  onSort,
  loading = false,
  className,
}: PaginatedTableProps<T>) {
  if (loading) {
    return (
      <Card className={className}>
        <Box textAlign="center" py="8">
          <Spinner size="lg" />
          <Text mt="4">Loading...</Text>
        </Box>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <Box textAlign="center" py="8">
          <Text fontSize="lg" color="fg.muted" mb="4">
            {emptyStateMessage}
          </Text>
          {emptyStateAction && (
            <AuthGuard>
              <Link href={emptyStateAction.href}>
                <Button variant="surface" colorPalette="green">
                  {emptyStateAction.label}
                </Button>
              </Link>
            </AuthGuard>
          )}
        </Box>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Table.Root>
        <Table.Header>
          <Table.Row bg="transparent">
            {columns.map((column) => (
              <Table.ColumnHeader
                key={String(column.field)}
                width={column.width}
                cursor={column.sortable ? "pointer" : "default"}
                onClick={() => {
                  if (column.sortable && onSort) {
                    // Toggle sort order or default to 'asc'
                    onSort(column.field, "asc");
                  }
                }}
              >
                {column.label}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => (
            <Table.Row key={index} bg="transparent">
              {columns.map((column) => (
                <Table.Cell key={String(column.field)}>
                  {column.render
                    ? column.render(item[column.field], item)
                    : String(item[column.field] || "-")}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      {meta && (
        <Pagination
          meta={meta}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </Card>
  );
}

export type { Column, PaginatedTableProps };
