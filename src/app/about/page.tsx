import Link from "next/link";

export default function AboutPage() {
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
          <h1 className="text-3xl font-semibold text-zinc-950">About Us</h1>
          <div className="mt-6 space-y-4 text-base text-zinc-700">
            <p>
              Welcome to our platform! Here you will find comprehensive placement
              information to help you navigate your career journey.
            </p>
            <p>
              We are dedicated to providing you with the latest job updates,
              placement opportunities, and valuable resources to help you
              succeed in your professional endeavors.
            </p>
            <p>
              Our mission is to make placement information easily accessible,
              helping students and job seekers stay informed about the latest
              opportunities from top companies.
            </p>
            <p>
              Whether you're looking for campus placements, off-campus
              opportunities, or interview preparation materials, you'll find
              everything you need right here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


