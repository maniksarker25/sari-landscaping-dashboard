import { Badge } from "@/components/ui/badge";
import type { ContentStatus, MessageStatus } from "@/types";

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge variant={status === "published" ? "success" : "outline"}>
      {status === "published" ? "Published" : "Draft"}
    </Badge>
  );
}

const messageStatusVariant: Record<MessageStatus, "default" | "success" | "warning" | "outline"> = {
  new: "warning",
  read: "default",
  replied: "success",
  archived: "outline",
};

const messageStatusLabel: Record<MessageStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  return <Badge variant={messageStatusVariant[status]}>{messageStatusLabel[status]}</Badge>;
}
