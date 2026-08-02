import type { ServiceFormValues } from "@/lib/validations";
import type { PageBlock, GalleryItem } from "@/types";
import { fileRegistry } from "@/lib/file-registry";

export interface ServiceFormDataOptions {
  isUpdate?: boolean;
}

/**
 * Builds a FormData object conforming strictly to the Service API specification:
 * - 'data': JSON string of service title, slug, category, sections, and seo (without File objects)
 * - 'service_image': Featured image file (if new/replacement uploaded)
 * - 'gallery_images': Repeat key for uploaded gallery image files
 * - 'galleryImageMap': JSON string mapping uploaded files to gallery items via uploadKey and fileIndex
 */
export function buildServiceFormData(
  values: ServiceFormValues,
  _options: ServiceFormDataOptions = {},
): FormData {
  const formData = new FormData();

  const galleryFiles: File[] = [];
  const galleryImageMap: { uploadKey: string; fileIndex: number }[] = [];

  // Deep clone and process sections
  const cleanedSections: PageBlock[] = (values.sections || []).map(
    (sec, secIdx) => {
      const sectionCopy: PageBlock = {
        ...sec,
        order: typeof sec.order === "number" ? sec.order : secIdx + 1,
        content: { ...sec.content },
      };

      if (
        sec.blockType === "gallery_grid" &&
        Array.isArray(sec.content?.gallery)
      ) {
        const cleanedGallery: GalleryItem[] = sec.content.gallery.map(
          (item, itemIdx) => {
            // Build base cleaned item
            const cleanedItem: GalleryItem = {
              caption: item.caption || "",
              altText: item.altText || "",
            };

            // Don't include blob URLs as public imageUrl
            if (item.imageUrl && !item.imageUrl.startsWith("blob:")) {
              cleanedItem.imageUrl = item.imageUrl;
            }

            const attachedFile =
              (item.file && item.file instanceof File ? item.file : null) ||
              (item.uploadKey ? fileRegistry.get(item.uploadKey) : null);

            // Check if item has a new/replacement file attached
            if (attachedFile && attachedFile instanceof File) {
              const uploadKey =
                item.uploadKey ||
                `gallery-${secIdx + 1}-img-${itemIdx + 1}-${Date.now()}`;

              cleanedItem.uploadKey = uploadKey;

              galleryImageMap.push({
                uploadKey,
                fileIndex: galleryFiles.length,
              });

              galleryFiles.push(attachedFile);
            } else if (item.uploadKey) {
              // Preserve uploadKey if present
              cleanedItem.uploadKey = item.uploadKey;
            }

            // Strip binary File reference from JSON payload
            delete cleanedItem.file;

            return cleanedItem;
          },
        );

        sectionCopy.content = {
          ...sectionCopy.content,
          gallery: cleanedGallery,
        };
      }

      return sectionCopy;
    },
  );

  // Construct pure JSON payload for 'data' key
  const dataPayload: Record<string, any> = {
    title: values.title,
    slug: values.slug,
    category: values.category,
    sections: cleanedSections,
  };

  if (values.seo) {
    dataPayload.seo = values.seo;
  }

  const featuredFile =
    (values.featuredImageFile && values.featuredImageFile instanceof File
      ? values.featuredImageFile
      : null) || fileRegistry.get("featuredImageFile");

  // Include featured image URL if present and not replacing with file
  if (values.featuredImage && !featuredFile && !values.featuredImage.startsWith("blob:")) {
    dataPayload.featuredImage = values.featuredImage;
  }

  // 1. Append 'data'
  formData.append("data", JSON.stringify(dataPayload));

  // 2. Append 'service_image' if featured file is selected
  if (featuredFile && featuredFile instanceof File) {
    formData.append("service_image", featuredFile);
  }

  // 3. Append 'gallery_images'
  galleryFiles.forEach((file) => {
    formData.append("gallery_images", file);
  });

  // 4. Append 'galleryImageMap' if gallery images were uploaded
  if (galleryImageMap.length > 0) {
    formData.append("galleryImageMap", JSON.stringify(galleryImageMap));
  }

  return formData;
}
