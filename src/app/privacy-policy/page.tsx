import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 px-4 py-16 font-sans text-zinc-900">
      <main className="mx-auto flex max-w-4xl flex-col gap-8">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to home
        </Link>

        <section className="rounded-3xl bg-white p-8 shadow-lg shadow-zinc-200">
          <h1 className="text-3xl font-semibold text-zinc-950">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Last updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="mt-8 space-y-6 text-base text-zinc-700">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Introduction
              </h2>
              <p>
              Your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and the choices you have.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Information We Collect
              </h2>
              <p>
              We may collect: <br />

Basic analytics data (pages visited, device type, browser, approximate location). <br />

Information you voluntarily provide (such as contacting us via email). <br />

Log data such as IP address and timestamps for security and analytics. <br />
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
              Use of Cookies
              </h2>
              <p>
              We use cookies to: <br />

Improve user experience <br />

Analyze website performance <br />

Run advertising services like Google AdSense <br />

You can disable cookies in your browser settings. <br />
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Data Security
              </h2>
              <p>
              We do not sell, rent, or trade any personal information. <br />
              Any data collected is used only for improving user experience and website performance. <br />
              We implement security measures to protect your data.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
              Google AdSense & Third-Party Ads
              </h2>
              <p>
              We use Google AdSense to show ads.
Google may use cookies (including DoubleClick cookies) to: <br />

Show personalized ads <br />

Measure ad performance <br />
Users may opt out of personalized ads by visiting: <br />
<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">https://www.google.com/settings/ads</a> <br />

Google’s Privacy Policy: <br />
<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a> <br />  
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Third-Party Services
              </h2>
              <p>
              Our website may contain links to external websites.
              We are not responsible for their content or privacy practices. <br />
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:lmkleela1@gmail.com"
                  className="text-indigo-600 hover:underline"
                >
                  lmkleela1@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

