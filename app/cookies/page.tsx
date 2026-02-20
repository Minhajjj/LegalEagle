export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE] pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1C212B] mb-8 font-serif">
          Cookie Policy
        </h1>
        <div className="bg-white p-8 rounded-xl border border-[#E5E5E5] text-[#1C212B]/80 space-y-6">
          <p className="text-sm text-[#1C212B]/60">Last Updated: October 2025</p>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a website
              you visit. A cookie file is stored in your web browser and allows the
              Service or a third-party to recognize you and make your next visit
              easier and the Service more useful to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              How LegalEagle Uses Cookies
            </h2>
            <p>
              When you use and access the Service, we may place a number of cookies
              files in your web browser. We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>To enable certain functions of the Service</li>
              <li>To provide analytics</li>
              <li>To store your preferences</li>
              <li>
                To enable advertisements delivery, including behavioral advertising
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1C212B] mb-3">
              Your Choices Regarding Cookies
            </h2>
            <p>
              If you'd like to delete cookies or instruct your web browser to delete
              or refuse cookies, please visit the help pages of your web browser.
              Please note, however, that if you delete cookies or refuse to accept
              them, you might not be able to use all of the features we offer, you
              may not be able to store your preferences, and some of our pages might
              not display properly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
