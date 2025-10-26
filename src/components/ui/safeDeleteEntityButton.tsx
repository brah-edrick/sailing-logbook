"use client";

import { useRouter } from "next/navigation";
import { Button, Dialog, Portal, CloseButton, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

interface SafeDeleteEntityButtonProps {
  entityId: number;
  entityName: string;
  entityType: "boat" | "activity";
  onSuccess?: () => void;
  requireConfirmation?: boolean;
  className?: string;
}

export function SafeDeleteEntityButton({
  entityId,
  entityName,
  entityType,
  onSuccess,
  requireConfirmation = true,
  className,
}: SafeDeleteEntityButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/${entityType}s/${entityId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toaster.create({
          title: "Success",
          description: `${entityName} deleted successfully`,
          type: "success",
        });

        // Use custom success handler or default navigation
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/${entityType}s`);
        }
      } else {
        toaster.create({
          title: "Error",
          description: `Failed to delete ${entityName}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      toaster.create({
        title: "Error",
        description: `Network error while deleting ${entityName}`,
        type: "error",
      });
    }
  };

  const deleteButton = (
    <Button variant="surface" colorPalette="red" className={className}>
      Delete
    </Button>
  );

  // If confirmation is not required, return a simple button
  if (!requireConfirmation) {
    return (
      <Button
        variant="surface"
        colorPalette="red"
        onClick={handleDelete}
        className={className}
      >
        Delete
      </Button>
    );
  }

  // Return confirmation dialog
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{deleteButton}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                Delete{" "}
                {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>Are you sure you want to delete {entityName}?</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button
                  onClick={handleDelete}
                  variant="surface"
                  colorPalette="red"
                >
                  Confirm Delete {entityName}
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
