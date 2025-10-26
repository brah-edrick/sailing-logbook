import React from "react";
import { render, screen } from "@test-utils/render";
import { PaginatedTable, Column } from "@/components/paginatedTable";
import { PaginationMeta } from "@/types/api";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    entries: jest.fn().mockReturnValue([]),
  }),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock Pagination component
jest.mock("@/components/pagination", () => ({
  Pagination: ({
    meta,
    onPageChange,
    onLimitChange,
  }: {
    meta: { page: number; totalPages: number };
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  }) => (
    <div data-testid="pagination">
      <span>
        Page {meta.page} of {meta.totalPages}
      </span>
      <button onClick={() => onPageChange?.(meta.page + 1)}>Next</button>
      <button onClick={() => onLimitChange?.(20)}>Change Limit</button>
    </div>
  ),
}));

interface TestItem {
  id: number;
  name: string;
  value: number;
}

const testColumns: Column<TestItem>[] = [
  {
    field: "id",
    label: "ID",
    sortable: true,
  },
  {
    field: "name",
    label: "Name",
    render: (value: unknown) => (
      <span data-testid={`name-${value}`}>{String(value)}</span>
    ),
  },
  {
    field: "value",
    label: "Value",
    render: (value: unknown) => (
      <span data-testid={`value-${value}`}>{String(value)}</span>
    ),
  },
];

const testMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 25,
  totalPages: 3,
  hasNextPage: true,
  hasPrevPage: false,
};

describe("PaginatedTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    render(
      <PaginatedTable
        data={[]}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
        loading={true}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders empty state with action", () => {
    const emptyStateAction = {
      label: "Add Item",
      href: "/add",
    };

    render(
      <PaginatedTable
        data={[]}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items found"
        emptyStateAction={emptyStateAction}
      />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("renders empty state without action", () => {
    render(
      <PaginatedTable
        data={[]}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items found"
      />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders table with data", () => {
    const testData: TestItem[] = [
      { id: 1, name: "Item 1", value: 100 },
      { id: 2, name: "Item 2", value: 200 },
    ];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
      />
    );

    // Check headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();

    // Check data rows
    expect(screen.getByTestId("name-Item 1")).toBeInTheDocument();
    expect(screen.getByTestId("value-100")).toBeInTheDocument();
    expect(screen.getByTestId("name-Item 2")).toBeInTheDocument();
    expect(screen.getByTestId("value-200")).toBeInTheDocument();

    // Check pagination
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("renders data without custom render functions", () => {
    const simpleColumns: Column<TestItem>[] = [
      {
        field: "id",
        label: "ID",
      },
      {
        field: "name",
        label: "Name",
      },
    ];

    const testData: TestItem[] = [{ id: 1, name: "Item 1", value: 100 }];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={simpleColumns}
        emptyStateMessage="No items"
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("handles null/undefined values", () => {
    const testData = [
      {
        id: 1,
        name: null as unknown as string,
        value: undefined as unknown as number,
      },
    ];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
      />
    );

    // Check that null/undefined values are handled by the render functions
    expect(screen.getByTestId("name-null")).toBeInTheDocument();
    expect(screen.getByTestId("value-undefined")).toBeInTheDocument();
  });

  it("calls onPageChange when pagination changes", () => {
    const onPageChange = jest.fn();
    const testData: TestItem[] = [{ id: 1, name: "Item 1", value: 100 }];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByText("Next");
    nextButton.click();

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onLimitChange when limit changes", () => {
    const onLimitChange = jest.fn();
    const testData: TestItem[] = [{ id: 1, name: "Item 1", value: 100 }];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
        onLimitChange={onLimitChange}
      />
    );

    const changeLimitButton = screen.getByText("Change Limit");
    changeLimitButton.click();

    expect(onLimitChange).toHaveBeenCalledWith(20);
  });

  it("applies custom className", () => {
    const testData: TestItem[] = [{ id: 1, name: "Item 1", value: 100 }];

    const { container } = render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles sortable columns", () => {
    const onSort = jest.fn();
    const testData: TestItem[] = [{ id: 1, name: "Item 1", value: 100 }];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
        onSort={onSort}
      />
    );

    const idHeader = screen.getByText("ID");
    idHeader.click();

    expect(onSort).toHaveBeenCalledWith("id", "asc");
  });

  it("does not call onSort for non-sortable columns", () => {
    const onSort = jest.fn();
    const testData: TestItem[] = [{ id: 1, name: "Item 1", value: 100 }];

    render(
      <PaginatedTable
        data={testData}
        meta={testMeta}
        columns={testColumns}
        emptyStateMessage="No items"
        onSort={onSort}
      />
    );

    const nameHeader = screen.getByText("Name");
    nameHeader.click();

    expect(onSort).not.toHaveBeenCalled();
  });
});
