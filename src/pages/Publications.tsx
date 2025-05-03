
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublications, deletePublication, Publication } from "@/services/api";
import Layout from "@/components/dashboard/Layout";
import Header from "@/components/dashboard/Header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Pencil, Trash2, FilePlus, Loader2, Eye } from "lucide-react";
import PublicationForm from "@/components/publications/PublicationForm";
import PublicationView from "@/components/publications/PublicationView";
import { toast } from "sonner";

const Publications = () => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [publicationToEdit, setPublicationToEdit] = useState<Publication | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [publicationToView, setPublicationToView] = useState<Publication | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ["publications"],
    queryFn: getPublications,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePublication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      toast.success("Publication deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting publication:", error);
      toast.error("Failed to delete publication");
    },
  });

  const handleDeleteClick = (publication: Publication) => {
    setPublicationToDelete(publication);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (publicationToDelete) {
      deleteMutation.mutate(publicationToDelete.id);
    }
  };

  const handleEditClick = (publication: Publication) => {
    setPublicationToEdit(publication);
    setEditDialogOpen(true);
  };

  const handleViewClick = (publication: Publication) => {
    setPublicationToView(publication);
    setViewDialogOpen(true);
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Layout>
      <Header 
        title="Publications Management" 
        description="Manage articles, news, and posts" 
        action={{
          label: "Add Publication",
          onClick: handleAddClick,
        }}
      />
      
      <div className="p-6">
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-amodes" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No publications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    publications.map((publication) => (
                      <TableRow key={publication.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {publication.titulo}
                        </TableCell>
                        <TableCell>{publication.categoria}</TableCell>
                        <TableCell>{formatDate(publication.created_at)}</TableCell>
                        <TableCell>
                          {publication.fotos && publication.fotos.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <img
                                src={publication.fotos[0]}
                                alt={publication.titulo}
                                className="h-8 w-8 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                              {publication.fotos.length > 1 && (
                                <span className="text-xs text-gray-500">
                                  +{publication.fotos.length - 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">No media</span>
                          )}
                        </TableCell>
                        <TableCell className="w-32">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewClick(publication)}
                              title="View Publication"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(publication)}
                              title="Edit Publication"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteClick(publication)}
                              title="Delete Publication"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the publication "{publicationToDelete?.titulo}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Publication Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
            <DialogDescription>
              Update the publication details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {publicationToEdit && (
            <PublicationForm 
              publication={publicationToEdit} 
              onSuccess={() => {
                setEditDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ["publications"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Publication Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publication Details</DialogTitle>
          </DialogHeader>
          {publicationToView && (
            <PublicationView publication={publicationToView} />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Publication Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Publication</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new publication. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <PublicationForm
            onSuccess={() => {
              setAddDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ["publications"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Publications;
