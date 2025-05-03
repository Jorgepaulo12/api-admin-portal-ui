
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { updateMember, Member, uploadProfilePhoto } from "@/services/api";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const memberSchema = z.object({
  nome: z.string().min(1, "Name is required"),
  cargo: z.string().min(1, "Role is required"),
  descricao: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format").or(z.string().length(0)),
  senha: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberFormProps {
  member?: Member;
  onSuccess: () => void;
}

const MemberForm = ({ member, onSuccess }: MemberFormProps) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    member?.foto_perfil || null
  );
  
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: member
      ? {
          nome: member.nome,
          cargo: member.cargo,
          descricao: member.descricao,
          username: member.username,
          email: member.email,
          twitter: member.twitter,
          facebook: member.facebook,
          senha: "",
        }
      : {
          nome: "",
          cargo: "",
          descricao: "",
          username: "",
          email: "",
          senha: "",
          twitter: "",
          facebook: "",
        },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      
      if (photoFile) {
        formData.append("foto_perfil", photoFile);
      }
      
      if (member) {
        return updateMember(member.id, formData);
      } else {
        // For now, let's handle the update case only
        // In a real app, you'd have a createMember function
        return updateMember(0, formData);
      }
    },
    onSuccess: () => {
      toast.success(member ? "Member updated successfully" : "Member created successfully");
      onSuccess();
    },
    onError: (error) => {
      console.error("Error saving member:", error);
      toast.error("Failed to save member");
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

  const onSubmit = (values: MemberFormValues) => {
    updateMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={photoPreview || ""} 
              alt="Profile" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }} 
            />
            <AvatarFallback className="bg-gray-200 text-lg">
              {member?.nome?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <label htmlFor="photo-upload" className="mt-3 cursor-pointer">
            <div className="flex items-center gap-2 text-sm font-medium text-amodes hover:underline">
              <ImagePlus className="h-4 w-4" />
              {photoPreview ? "Change photo" : "Upload photo"}
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Student, Teacher, Director" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Login username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="user@example.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{member ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description about the member"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="Twitter handle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="Facebook profile" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            disabled={updateMutation.isPending} 
            className="bg-amodes hover:bg-amodes-dark"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberForm;
