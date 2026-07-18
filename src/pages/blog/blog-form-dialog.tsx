import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { blogFormSchema, type BlogFormValues } from "@/lib/validations";
import { useBlogStore } from "@/lib/content-stores";
import { slugify, generateId } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface BlogFormDialogProps {
  open: boolean;
  post?: BlogPost;
  onOpenChange: (open: boolean) => void;
}

export function BlogFormDialog({ open, post, onOpenChange }: BlogFormDialogProps) {
  const add = useBlogStore((s) => s.add);
  const update = useBlogStore((s) => s.update);
  const isEditing = !!post;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: "Aurelia Design Studio",
      category: "",
      status: "draft",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        post
          ? {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              coverImage: post.coverImage,
              author: post.author,
              category: post.category,
              status: post.status,
            }
          : {
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              coverImage: "",
              author: "Aurelia Design Studio",
              category: "",
              status: "draft",
            }
      );
    }
  }, [open, post, reset]);

  const status = watch("status");
  const title = watch("title");

  function handleTitleBlur() {
    if (!isEditing && title && !watch("slug")) {
      setValue("slug", slugify(title));
    }
  }

  async function onSubmit(values: BlogFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const now = new Date().toISOString();

    if (isEditing && post) {
      update(post.id, { ...values, updatedAt: now });
      toast.success(`"${values.title}" updated`);
    } else {
      add({ id: generateId("post"), ...values, publishedAt: now, updatedAt: now });
      toast.success(`"${values.title}" created`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Post" : "New Blog Post"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this blog post." : "Write a new article for your blog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} onBlur={handleTitleBlur} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...register("author")} />
              {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="Pools, Landscaping, Lighting..." {...register("category")} />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input id="coverImage" placeholder="https://..." {...register("coverImage")} />
            {errors.coverImage && <p className="text-xs text-destructive">{errors.coverImage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" rows={2} {...register("excerpt")} />
            {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" rows={6} {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setValue("status", value as "published" | "draft")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Save changes" : "Publish post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
