import { getAllMessages } from "@/src/actions/message";
import { MessageListClient } from "./MessageListClient";

export default async function AdminMessagesPage() {
  const { data: messages, error } = await getAllMessages();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
            Messages
          </h1>
          <p className="mt-1 text-sm text-muted">
            Messages sent from the contact form.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <MessageListClient messages={messages ?? []} />
    </section>
  );
}