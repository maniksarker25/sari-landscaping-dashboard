import * as React from "react";
import { toast } from "sonner";
import { Loader2, Save, FileText, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/common/Tiptap";
import {
  useGetTermsConditionsQuery,
  useAddTermsConditionsMutation,
  useEditTermsConditionsMutation,
  type CommonContentItem,
} from "@/redux/services/manage/termsConditionsApi";

export default function TermsConditionsPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetTermsConditionsQuery();
  const [addTerms, { isLoading: isAdding }] = useAddTermsConditionsMutation();
  const [editTerms, { isLoading: isEditing }] =
    useEditTermsConditionsMutation();
  const [content, setContent] = React.useState("");
  const [docId, setDocId] = React.useState<string | null>(null);

  // Extract content item from response
  React.useEffect(() => {
    if (response?.data) {
      const item: CommonContentItem | undefined = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      if (item) {
        setContent(item.content || "");
        setDocId(item._id || item.id || null);
      }
    }
  }, [response]);

  const isSaving = isAdding || isEditing;

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();

    try {
      if (docId) {
        await editTerms({
          id: docId,
          data: { title: "terms-conditions-title", content },
        }).unwrap();
        toast.success("Terms & Conditions updated successfully!");
      } else {
        const res = await addTerms({
          title: "terms-conditions-title",
          content,
        }).unwrap();
        if (res?.data) {
          const newItem = Array.isArray(res.data) ? res.data[0] : res.data;
          if (newItem?._id || newItem?.id) {
            setDocId(newItem._id || newItem.id || null);
          }
        }
        toast.success("Terms & Conditions created successfully!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save Terms & Conditions.");
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Fixed / Sticky Top Action Bar */}
      <div className="sticky top-0 z-20 -mx-6 px-6 py-4 bg-background/95 backdrop-blur border-b border-border/80 shadow-xs transition-all">
        <PageHeader
          title="Terms & Conditions"
          description="Manage and publish the official Terms & Conditions content for your website."
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading || isSaving}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                type="button"
                onClick={() => handleSave()}
                disabled={isLoading || isSaving}
                className="min-w-[130px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          }
        />
      </div>

      {isLoading ? (
        <Card className="p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading Terms & Conditions content...</p>
          </div>
        </Card>
      ) : isError ? (
        <Card className="p-8 border-destructive/20 bg-destructive/5 text-center space-y-3">
          <p className="text-destructive font-medium">
            Failed to load content from the server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </Card>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardContent className="space-y-5 pt-5">
              {/* Rich Text Editor */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Document Body Content
                </Label>
                <Tiptap
                  content={content}
                  setContent={setContent}
                  placeholder="Write terms and conditions content here..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button type="submit" disabled={isSaving} className="min-w-[140px]">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
