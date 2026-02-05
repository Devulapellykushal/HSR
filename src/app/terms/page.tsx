import SectionHeader from '@/components/common/SectionHeader';

export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 md:p-12">
                    <SectionHeader
                        title="Terms of Service"
                        subtitle="Please read these terms carefully before using our services"
                    />

                    <div className="prose prose-green max-w-none mt-8 text-gray-600">
                        <h3>1. Introduction</h3>
                        <p>
                            Welcome to HSR Green Homes. By accessing our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>

                        <h3>2. Use of Website</h3>
                        <p>
                            The content on this website is for general information purposes only. It is subject to change without notice. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.
                        </p>

                        <h3>3. Project Information</h3>
                        <p>
                            All project details, including prices, floor plans, and amenities, are subject to change. While we strive for accuracy, we cannot guarantee that all information is completely current or error-free. Please contact our sales team for the most up-to-date information.
                        </p>

                        <h3>4. Intellectual Property</h3>
                        <p>
                            This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice.
                        </p>

                        <h3>5. Contact</h3>
                        <p>
                            If you have any questions about these Terms, please contact us at greenhomes088@gmail.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
