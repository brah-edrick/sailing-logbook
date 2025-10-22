import { Text, Link } from "@chakra-ui/react";
import { NewBoatForm } from "@/components/form/boat";

export default function NewBoatPage() {
  return (
    <main>
      <Link href="/boats">
        <Text
          color="blue.500"
          fontSize="sm"
          _hover={{ textDecoration: "underline" }}
        >
          ← Back to Boats
        </Text>
      </Link>
      <NewBoatForm />
    </main>
  );
}
