
import { format } from "date-fns";
import { Publication } from "@/services/api";
import { Separator } from "@/components/ui/separator";

interface PublicationViewProps {
  publication: Publication;
}

const PublicationView = ({ publication }: PublicationViewProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{publication.titulo}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-2 gap-3">
          <span>Category: {publication.categoria}</span>
          <span>•</span>
          <span>Created: {formatDate(publication.created_at)}</span>
        </div>
      </div>

      <Separator />
      
      {publication.fotos && publication.fotos.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publication.fotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${publication.titulo} - Image ${index + 1}`}
                className="rounded-md object-cover w-full h-44"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Content</h3>
        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
          {publication.conteudo}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Created at</p>
          <p>{formatDate(publication.created_at)}</p>
        </div>
        <div>
          <p className="text-gray-500">Last updated</p>
          <p>{formatDate(publication.updated_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicationView;
