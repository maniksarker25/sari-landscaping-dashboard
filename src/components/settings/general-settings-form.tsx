import React, { useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  legalInfoSchema,
  type LegalInfoFormValues,
} from "@/lib/validations";
import {
  useAddUpdateLegalInfoMutation,
  useGetLegalInfoQuery,
} from "@/redux/services/legalinfoApis";

export const GeneralSettingsForm = React.memo(function GeneralSettingsForm() {
  const {
    data: legalInfoResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetLegalInfoQuery();

  const [addUpdateLegalInfo, { isLoading: isMutating }] =
    useAddUpdateLegalInfoMutation();

  const defaultValues = useMemo<LegalInfoFormValues>(
    () => ({
      siteName: "",
      tagline: "",
      companyName: "",
      businessType: "",
      registeredAddress: "",
      contactEmail: "",
      contactPhone: "",
      jurisdiction: "",
      officialWebsite: "",
      facebookLink: "",
      instagramLink: "",
      linkedinLink: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LegalInfoFormValues>({
    resolver: zodResolver(legalInfoSchema),
    defaultValues,
  });

  const legalData = useMemo(() => legalInfoResponse?.data, [legalInfoResponse]);

  useEffect(() => {
    if (legalData) {
      reset({
        siteName: legalData?.siteName || "",
        tagline: legalData?.tagline || "",
        companyName: legalData?.companyName || "",
        businessType: legalData?.businessType || "",
        registeredAddress: legalData?.registeredAddress || "",
        contactEmail: legalData?.contactEmail || "",
        contactPhone: legalData?.contactPhone || "",
        jurisdiction: legalData?.jurisdiction || "",
        officialWebsite: legalData?.officialWebsite || "",
        facebookLink: legalData?.facebookLink || "",
        instagramLink: legalData?.instagramLink || "",
        linkedinLink: legalData?.linkedinLink || "",
      });
    }
  }, [legalData, reset]);

  const onSubmit = useCallback(
    async (values: LegalInfoFormValues) => {
      try {
        const res = await addUpdateLegalInfo(values).unwrap();
        toast.success(
          res?.message || "Site legal information updated successfully!",
        );
      } catch (err: any) {
        const errorSources = err?.data?.errorSources || err?.data?.errors;
        if (Array.isArray(errorSources) && errorSources.length > 0) {
          errorSources.forEach((e: { path: string; message: string }) => {
            if (e?.path) {
              setError(e.path as keyof LegalInfoFormValues, {
                type: "server",
                message: e.message,
              });
            }
          });
        } else if (err?.data?.message) {
          toast.error(err.data.message);
        } else {
          toast.error("Failed to update legal information.");
        }
      }
    },
    [addUpdateLegalInfo, setError],
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Site & Legal Information</CardTitle>
            {isFetching && !isLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>
          <CardDescription>
            This information is used across your website's header, footer,
            metadata, and legal documents.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12 space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm font-medium">
              Loading site information...
            </span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <p className="text-xs text-destructive font-medium">
              Failed to load site & legal information.
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Retry
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site name</Label>
                <Input
                  id="siteName"
                  placeholder="e.g. Sari Landscaping"
                  aria-invalid={!!errors?.siteName}
                  {...register("siteName")}
                />
                {errors?.siteName && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.siteName?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="e.g. Luxury Swimming Pools & Landscaping"
                  aria-invalid={!!errors?.tagline}
                  {...register("tagline")}
                />
                {errors?.tagline && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.tagline?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Sari Landscaping LLC"
                  aria-invalid={!!errors?.companyName}
                  {...register("companyName")}
                />
                {errors?.companyName && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.companyName?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business type</Label>
                <Input
                  id="businessType"
                  placeholder="e.g. Limited Liability Company (LLC)"
                  aria-invalid={!!errors?.businessType}
                  {...register("businessType")}
                />
                {errors?.businessType && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.businessType?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g. info@sarilandscaping.ae"
                  aria-invalid={!!errors?.contactEmail}
                  {...register("contactEmail")}
                />
                {errors?.contactEmail && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.contactEmail?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="e.g. +971 4 123 4567"
                  aria-invalid={!!errors?.contactPhone}
                  {...register("contactPhone")}
                />
                {errors?.contactPhone && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.contactPhone?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="officialWebsite">Official website</Label>
                <Input
                  id="officialWebsite"
                  placeholder="e.g. https://sarilandscaping.ae"
                  aria-invalid={!!errors?.officialWebsite}
                  {...register("officialWebsite")}
                />
                {errors?.officialWebsite && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.officialWebsite?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Input
                  id="jurisdiction"
                  placeholder="e.g. Dubai, United Arab Emirates"
                  aria-invalid={!!errors?.jurisdiction}
                  {...register("jurisdiction")}
                />
                {errors?.jurisdiction && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.jurisdiction?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registeredAddress">Registered address</Label>
              <Textarea
                id="registeredAddress"
                rows={2}
                placeholder="e.g. Business Bay, Al Manara Tower, Office 1402, Dubai, UAE"
                aria-invalid={!!errors?.registeredAddress}
                {...register("registeredAddress")}
              />
              {errors?.registeredAddress && (
                <p className="text-xs text-destructive font-medium">
                  {errors?.registeredAddress?.message}
                </p>
              )}
            </div>

            {/* Social Media Links */}
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="facebookLink">Facebook link</Label>
                <Input
                  id="facebookLink"
                  placeholder="e.g. https://facebook.com/sarilandscaping"
                  aria-invalid={!!errors?.facebookLink}
                  {...register("facebookLink")}
                />
                {errors?.facebookLink && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.facebookLink?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramLink">Instagram link</Label>
                <Input
                  id="instagramLink"
                  placeholder="e.g. https://instagram.com/sarilandscaping"
                  aria-invalid={!!errors?.instagramLink}
                  {...register("instagramLink")}
                />
                {errors?.instagramLink && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.instagramLink?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinLink">LinkedIn link</Label>
                <Input
                  id="linkedinLink"
                  placeholder="e.g. https://linkedin.com/company/sarilandscaping"
                  aria-invalid={!!errors?.linkedinLink}
                  {...register("linkedinLink")}
                />
                {errors?.linkedinLink && (
                  <p className="text-xs text-destructive font-medium">
                    {errors?.linkedinLink?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-4">
              <Button type="submit" disabled={isMutating}>
                {isMutating && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Save changes
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
});
