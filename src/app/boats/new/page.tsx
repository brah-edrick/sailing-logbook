import { Heading, Text, Link } from "@chakra-ui/react";
import { NewBoatForm } from "@/components/form/boat";

export default function NewBoatPage() {
  return (
    <main>
      <Link href="/boats">
        <Text>Back to Boats</Text>
      </Link>
      <Heading size="3xl" mb="6">
        Add a New Boat
      </Heading>
      <NewBoatForm />
    </main>
  );
}
