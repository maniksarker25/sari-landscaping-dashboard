import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Tag,
  Wrench,
  CheckCheck,
  Archive,
  Trash2,
  MailOpen,
  Loader2,
  RotateCcw,
  User,
} from "lucide-react";
import { MessageStatusBadge } from "@/components/common/status-badge";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import {
  useGetSingleContactQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  CONTACT_STATUS,
  type ContactStatus,
} from "@/redux/services/messageApis";

export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSingleContactQuery(id || "", {
    skip: !id,
  });

  const [updateContactStatus, { isLoading: isUpdatingStatus }] =
    useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const contact = apiResponse?.data;

  // Auto-mark new messages as Read when opened
  React.useEffect(() => {
    if (contact && id && String(contact.status).toLowerCase() === "new") {
      updateContactStatus({ id, status: CONTACT_STATUS.Read });
    }
  }, [contact, id, updateContactStatus]);

  const handleStatusChange = async (newStatus: ContactStatus) => {
    if (!id) return;
    try {
      await updateContactStatus({ id, status: newStatus }).unwrap();
      toast.success(`Message marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to update status",
      );
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteContact(id).unwrap();
      toast.success("Message deleted successfully");
      navigate("/messages");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to delete message",
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/messages")}
            title="Back to messages"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Message Detail
              </h1>
              {isFetching && !isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              View full message submission details and respond to client
              inquiries.
            </p>
          </div>
        </div>

        {contact && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  ) : (
                    <MessageStatusBadge status={contact.status} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusChange(CONTACT_STATUS.New)}
                >
                  <Mail className="h-4 w-4 mr-2" /> Mark as New
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(CONTACT_STATUS.Read)}
                >
                  <MailOpen className="h-4 w-4 mr-2" /> Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(CONTACT_STATUS.Replied)}
                >
                  <CheckCheck className="h-4 w-4 mr-2" /> Mark as Replied
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(CONTACT_STATUS.Archived)}
                >
                  <Archive className="h-4 w-4 mr-2" /> Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Loading / Error / Data */}
      {isLoading ? (
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
          </CardContent>
        </Card>
      ) : isError || !contact ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-destructive">
              Failed to load contact message or message not found.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Retry
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/messages")}
              >
                Return to Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left / Top Side: Contact Info Overview Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sender Name
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {contact.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary font-medium hover:underline flex items-center gap-1.5 mt-0.5 break-all"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </p>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-foreground font-medium hover:text-primary flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {contact.phone}
                  </a>
                ) : (
                  <p className="text-muted-foreground italic mt-0.5">
                    — Not provided
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category Interest
                </p>
                {contact.interestedCategory ? (
                  <Badge
                    variant="outline"
                    className="mt-1 uppercase text-[10px] font-bold tracking-wider text-primary border-primary/30"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {contact.interestedCategory}
                  </Badge>
                ) : (
                  <p className="text-muted-foreground italic mt-0.5">— None</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Service Interest
                </p>
                {contact.interestedService ? (
                  <div className="flex items-center gap-1.5 mt-0.5 font-medium text-foreground">
                    <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                    {contact.interestedService}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic mt-0.5">
                    — General Inquiry
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Received Date
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateTime(contact.createdAt || contact.updatedAt || "")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right Side: Message Content & Quick Actions */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
              <div>
                <CardTitle className="text-base">Message Content</CardTitle>
                <CardDescription>
                  Submitted message details from customer inquiry form.
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <a
                  href={`mailto:${contact.email}?subject=RE: ${encodeURIComponent(contact.interestedService || "Your Inquiry")}`}
                >
                  <Mail className="h-4 w-4 mr-1.5" /> Reply Email
                </a>
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground min-h-[160px]">
                {contact.message}
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground mr-1">
                  Quick Actions:
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(CONTACT_STATUS.Replied)}
                  disabled={isUpdatingStatus}
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  Mark as Replied
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(CONTACT_STATUS.Archived)}
                  disabled={isUpdatingStatus}
                >
                  <Archive className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  Archive Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Contact Message?"
        description="Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
