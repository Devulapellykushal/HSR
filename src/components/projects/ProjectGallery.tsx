import Image from 'next/image';

interface ProjectGalleryProps {
  images: string[];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={image}
            alt={`Project image ${index + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      ))}
    </div>
  );
}

