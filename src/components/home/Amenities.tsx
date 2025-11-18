import SectionHeader from '../common/SectionHeader';

interface Amenity {
  name: string;
  icon: React.ReactNode;
}

const amenities: Amenity[] = [
  {
    name: 'Swimming Pool',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 13c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2s.9-2 2-2h16c1.1 0 2 .9 2 2zm-7-3c0-1.66-1.34-3-3-3H7v2h5c.55 0 1 .45 1 1s-.45 1-1 1h-2v2h2c1.66 0 3-1.34 3-3zM4 19h16v-2H4v2zM4 5h16V3H4v2z" />
      </svg>
    ),
  },
  {
    name: 'Gymnasium',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z" />
      </svg>
    ),
  },
  {
    name: 'Parking',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
  {
    name: '24/7 Security',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
  },
  {
    name: 'Garden',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-3-4c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-5 0c0 .83-.67 1.5-1.5 1.5S6.5 8.83 6.5 8 7.17 6.5 8 6.5 9.5 7.17 9.5 8zm-3 4c0 .83-.67 1.5-1.5 1.5S3.5 12.83 3.5 12 4.17 10.5 5 10.5 6.5 11.17 6.5 12zm15 0c0-.83-.67-1.5-1.5-1.5S19.5 11.17 19.5 12s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm-1.5-4c.83 0 1.5-.67 1.5-1.5S19.83 6.5 19 6.5 17.5 7.17 17.5 8s.67 1.5 1.5 1.5zm-5 4c0-.83-.67-1.5-1.5-1.5S11.5 11.17 11.5 12s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm-3-4c0-.83-.67-1.5-1.5-1.5S8.5 7.17 8.5 8 9.17 9.5 10 9.5 11.5 8.83 11.5 8zm-3 8c0-.83-.67-1.5-1.5-1.5S5.5 14.17 5.5 15s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm3 4c0-.83-.67-1.5-1.5-1.5S8.5 18.17 8.5 19s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm5-4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm3 4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5z" />
      </svg>
    ),
  },
  {
    name: 'Play Area',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
];

export default function Amenities() {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="World-Class Amenities"
          subtitle="Experience luxury living with premium amenities designed for your comfort"
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <div className="text-[#2E936B] scale-75 sm:scale-90 md:scale-100">
                  {amenity.icon}
                </div>
              </div>
              <div className="text-gray-900 font-medium text-sm sm:text-base">
                {amenity.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

