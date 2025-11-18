import Image from 'next/image';

interface FloorPlanViewerProps {
  floorPlans: {
    name: string;
    image: string;
    area?: string;
  }[];
}

export default function FloorPlanViewer({ floorPlans }: FloorPlanViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">Floor Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {floorPlans.map((plan, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="relative h-64 w-full bg-gray-100">
              <Image
                src={plan.image}
                alt={plan.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2">{plan.name}</h4>
              {plan.area && (
                <p className="text-gray-600">Area: {plan.area}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

