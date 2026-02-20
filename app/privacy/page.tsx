export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE] pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1C212B] mb-8 font-serif">
          Privacy Policy
        </h1>
        <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] text-[#1C212B]/80 space-y-6">
          <p className="text-sm text-[#1C212B]/60">Last Updated: October 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">1. Introduction</h2>
            <p>
              LegalEagle ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website or use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">2. Data We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when
              you create an account, upload documents for analysis, or contact our
              support team. This may include your name, email address, payment
              information, and the contents of the documents you upload.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">3. How We Use Your Data</h2>
            <p>
              We use your information to provide, maintain, and improve our
              services, to process transactions, and to communicate with you. We do
              NOT use your uploaded documents to train our public AI models without
              your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data.
              All documents are encrypted in transit and at rest. However, no
              method of transmission over the internet or electronic storage is
              100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact
              us at privacy@legaleagle.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
