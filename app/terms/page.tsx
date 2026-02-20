export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE] pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1C212B] mb-8 font-serif">
          Terms of Service
        </h1>
        <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] text-[#1C212B]/80 space-y-6">
          <p className="text-sm text-[#1C212B]/60">Last Updated: October 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the LegalEagle website and services, you agree
              to be bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              2. Description of Service
            </h2>
            <p>
              LegalEagle provides AI-powered document analysis tools. These tools
              are intended to assist legal professionals and individuals but do not
              constitute legal advice or create an attorney-client relationship.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              3. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use of
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              4. Intellectual Property
            </h2>
            <p>
              The LegalEagle platform and its original content, features, and
              functionality are owned by LegalEagle and are protected by
              international copyright, trademark, patent, trade secret, and other
              intellectual property or proprietary rights laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall LegalEagle, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
