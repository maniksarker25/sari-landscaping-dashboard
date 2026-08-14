import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, CheckCheck, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types";
import { CONTACT_STATUS } from "@/redux/services/messageApis";

interface MessageDetailModalProps {
  selected: ContactMessage | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateSelectedStatus: (status: string) => void;
}

export const MessageDetailModal = React.memo(function MessageDetailModal({
  selected,
  onClose,
  onUpdateStatus,
  onUpdateSelectedStatus,
}: MessageDetailModalProps) {
  const navigate = useNavigate();

  const handleOpenFullPage = useCallback(() => {
    if (selected?.id) {
      onClose();
      navigate(`/messages/${selected.id}`);
    }
  }, [selected, onClose, navigate]);

  const handleMarkReplied = useCallback(() => {
    if (selected?.id) {
      onUpdateStatus(selected.id, CONTACT_STATUS.Replied);
      onUpdateSelectedStatus(CONTACT_STATUS.Replied);
    }
  }, [selected, onUpdateStatus, onUpdateSelectedStatus]);

  const handleMarkArchived = useCallback(() => {
    if (selected?.id) {
      onUpdateStatus(selected.id, CONTACT_STATUS.Archived);
      onUpdateSelectedStatus(CONTACT_STATUS.Archived);
    }
  }, [selected, onUpdateStatus, onUpdateSelectedStatus]);

  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>
                {selected.email}
                {selected.phone ? ` · ${selected.phone}` : ""} ·{" "}
                {formatDateTime(selected.receivedAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 rounded-lg border bg-muted/40 p-3 text-xs">
                {selected.interestedCategory && (
                  <div>
                    <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Category
                    </p>
                    <p className="mt-0.5 font-medium text-foreground">
                      {selected.interestedCategory}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Service
                  </p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {selected.interestedService || selected.service}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground bg-muted/20 p-3 rounded-md border">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleOpenFullPage}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open Full Page
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${selected.email}`}>Reply by email</a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkReplied}
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark as replied
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkArchived}
                >
                  <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
