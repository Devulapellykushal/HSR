interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 ${className}`}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 px-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

