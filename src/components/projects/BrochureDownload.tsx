import Button from '../common/Button';

interface BrochureDownloadProps {
  brochureUrl?: string;
}

export default function BrochureDownload({
  brochureUrl = '/brochures/sample.pdf',
}: BrochureDownloadProps) {
  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = 'project-brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">Download Brochure</h3>
      <p className="text-gray-600 mb-4">
        Get detailed information about this project in our comprehensive
        brochure.
      </p>
      <Button onClick={handleDownload} size="lg">
        Download PDF
      </Button>
    </div>
  );
}

