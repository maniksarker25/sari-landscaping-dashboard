import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FolderKanban, MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectsStore } from "@/lib/content-stores";
import type { Project } from "@/types";
import { ProjectFormDialog } from "@/pages/projects/project-form-dialog";

export default function ProjectsPage() {
  const items = useProjectsStore((s) => s.items);
  const remove = useProjectsStore((s) => s.remove);

  const [search, setSearch] = React.useState("");
  const [formState, setFormState] = React.useState<{ open: boolean; project?: Project }>({ open: false });
  const [deleteTarget, setDeleteTarget] = React.useState<Project | null>(null);

  const filtered = items.filter((project) =>
    [project.title, project.location, project.category].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(project: Project) {
    remove(project.id);
    toast.success(`"${project.title}" deleted`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage completed projects shown in your portfolio."
        actions={
          <Button onClick={() => setFormState({ open: true })}>
            <Plus className="h-4 w-4" /> Add Project
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." className="max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try a different search, or add your first project."
          action={
            <Button onClick={() => setFormState({ open: true })}>
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
                <div className="absolute right-2 top-2">
                  <StatusBadge status={project.status} />
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">{project.category}</p>
                <h3 className="mt-1 truncate font-semibold">{project.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {project.location} &middot; {project.year}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setFormState({ open: true, project })}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(project)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectFormDialog
        open={formState.open}
        project={formState.project}
        onOpenChange={(open) => setFormState((s) => ({ ...s, open }))}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the project from your portfolio."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
