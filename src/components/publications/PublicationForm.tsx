
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { updatePublication, createPublication, Publication } from "@/services/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, XCircle, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const publicationSchema = z.object({
  titulo: z.string().min(1, "Title is required"),
  conteudo: z.string().min(1, "Content is required"),
  categoria: z.string().min(1, "Category is required"),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

interface PublicationFormProps {
  publication?: Publication;
  onSuccess: () => void;
}

const PublicationForm = ({ publication, onSuccess }: PublicationFormProps) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    publication?.fotos && publication.fotos.length > 0 ? publication.fotos[0] : null
  );

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: publication
      ? {
          titulo: publication.titulo,
          conteudo: publication.conteudo,
          categoria: publication.categoria,
        }
      : {
          titulo: "",
          conteudo: "",
          categoria: "",
        },
  });

  const mutation = useMutation({
    mutationFn: async (values: PublicationFormValues) => {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      if (photoFile) {
        formData.append("fotos", photoFile);
      }
      
      if (publication) {
        return updatePublication(publication.id, formData);
      } else {
        return createPublication(formData);
      }
    },
    onSuccess: () => {
      toast.success(
        publication 
          ? "Publication updated successfully" 
          : "Publication created successfully"
      );
      onSuccess();
    },
    onError: (error) => {
      console.error("Error saving publication:", error);
      toast.error("Failed to save publication");
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = (values: PublicationFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. News, Event, Article" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="conteudo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Publication content"
                    className="resize-none min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Media</FormLabel>
            {photoPreview ? (
              <div className="mt-2 relative border rounded-md overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={clearPhoto}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <label htmlFor="photo-upload" className="mt-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <ImagePlus className="h-10 w-10 text-gray-400" />
                <span className="mt-2 text-sm font-medium text-gray-500">
                  Click to upload image
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending} 
            className="bg-amodes hover:bg-amodes-dark"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PublicationForm;
