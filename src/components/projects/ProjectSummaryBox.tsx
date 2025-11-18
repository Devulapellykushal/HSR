interface ProjectSummaryBoxProps {
  price?: string;
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
  status: 'ongoing' | 'completed';
  location: string;
}

export default function ProjectSummaryBox({
  price,
  area,
  bedrooms,
  bathrooms,
  status,
  location,
}: ProjectSummaryBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">Project Summary</h3>
      <div className="space-y-4">
        {price && (
          <div>
            <span className="text-gray-600">Price: </span>
            <span className="font-semibold text-xl">{price}</span>
          </div>
        )}
        {area && (
          <div>
            <span className="text-gray-600">Area: </span>
            <span className="font-semibold">{area}</span>
          </div>
        )}
        {bedrooms && (
          <div>
            <span className="text-gray-600">Bedrooms: </span>
            <span className="font-semibold">{bedrooms}</span>
          </div>
        )}
        {bathrooms && (
          <div>
            <span className="text-gray-600">Bathrooms: </span>
            <span className="font-semibold">{bathrooms}</span>
          </div>
        )}
        <div>
          <span className="text-gray-600">Status: </span>
          <span
            className={`font-semibold ${
              status === 'completed' ? 'text-green-600' : 'text-orange-500'
            }`}
          >
            {status === 'completed' ? 'Completed' : 'Ongoing'}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Location: </span>
          <span className="font-semibold">{location}</span>
        </div>
      </div>
    </div>
  );
}

