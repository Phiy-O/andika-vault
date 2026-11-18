import { getAllMessages } from "@/src/actions/message";
import MessageWorkspace from "./_components/MessageWorkspace";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const initialSearch = Array.isArray(rawQuery)
    ? (rawQuery[0] ?? "")
    : (rawQuery ?? "");
  const { data: messages, error } = await getAllMessages();

  return (
    <MessageWorkspace
      key={initialSearch || "messages"}
      messages={messages ?? []}
      initialSearch={initialSearch}
      loadError={error}
    />
  );
}