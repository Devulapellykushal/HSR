interface AmenitiesGridProps {
  amenities: string[];
}

export default function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <span className="text-blue-600 mr-2">✓</span>
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

