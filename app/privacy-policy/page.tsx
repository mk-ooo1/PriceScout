import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PriceScout protects and handles your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 prose prose-blue">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

      <div className="space-y-6 text-gray-700">
        <p>
          At PriceScout, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by PriceScout and how we use it.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>
          PriceScout does not require you to create an account to use our comparison features. We do not collect Sensitive Personally Identifiable Information (PII) such as credit card numbers, physical addresses, or full names.
        </p>
        <p>
          <strong>Log Files and Analytics:</strong> Like many other websites, we utilize log files and analytics. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks. This information is used to analyze trends, administer the site, track user's movement around the site, and gather demographic information. For security and click-fraud prevention, IP addresses are mathematically hashed before being stored in our database.
        </p>
        <p>
          <strong>Email Addresses:</strong> If you choose to subscribe to our Deal Alerts, we collect your email address solely for the purpose of sending you promotional emails and alerts regarding price drops.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Cookies and Web Beacons</h2>
        <p>
          Like any other website, PriceScout uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Third-Party Privacy Policies (Merchants & Affiliates)</h2>
        <p>
          PriceScout acts as an affiliate platform. When you click on a product link, you are redirected to third-party merchant websites (such as Amazon, Flipkart, etc.). These third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective links, which are sent directly to users' browser. They automatically receive your IP address when this occurs.
        </p>
        <p>
          Note that PriceScout has no access to or control over these cookies that are used by third-party advertisers or merchants. We strongly advise you to consult the respective Privacy Policies of these third-party merchants for more detailed information.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
        </p>
      </div>
    </main>
  );
}
