import { Badge } from "@/components/ui/badge";
import type { ContentStatus, MessageStatus } from "@/types";

export function StatusBadge({ status }: { status: ContentStatus | "Published" | "Draft" | string }) {
  const isPublished = String(status).toLowerCase() === "published";
  return (
    <Badge variant={isPublished ? "success" : "outline"}>
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );
}

const messageStatusVariant: Record<string, "default" | "success" | "warning" | "outline"> = {
  new: "warning",
  read: "default",
  replied: "success",
  archived: "outline",
};

const messageStatusLabel: Record<string, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

export function MessageStatusBadge({ status }: { status?: MessageStatus | string }) {
  const normalized = String(status || "").toLowerCase();
  const variant = messageStatusVariant[normalized] || "default";
  const label = messageStatusLabel[normalized] || String(status || "New");
  return <Badge variant={variant}>{label}</Badge>;
}
