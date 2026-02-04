import SectionHeader from '@/components/common/SectionHeader';

export default function PrivacyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 md:p-12">
                    <SectionHeader
                        title="Privacy Policy"
                        subtitle="How we collect, use, and protect your information"
                        subtitle="How we collect, use, and protect your information"
                    />

                    <div className="prose prose-green max-w-none mt-8 text-gray-600">
                        <h3>1. Information Collection</h3>
                        <p>
                            We collect information you provide directly to us, such as when you fill out a contact form, request a brochure, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide.
                        </p>

                        <h3>2. Use of Information</h3>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, to respond to your comments and questions, and to send you related information, including confirmations, updates, and support messages.
                        </p>

                        <h3>3. Data Security</h3>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                        </p>

                        <h3>4. Third-Party Services</h3>
                        <p>
                            We may use third-party services (such as analytics providers) that collect, monitor, and analyze this type of information in order to increase our service's functionality. These third-party service providers have their own privacy policies addressing how they use such information.
                        </p>

                        <h3>5. Changes to This Policy</h3>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>

                        <h3>6. Contact Us</h3>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at greenhomes088@gmail.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
