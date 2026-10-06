import Link from "next/link";

export default function OfferUnavailablePage() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">This offer is no longer available</h1>
      <p className="text-gray-500 mt-2">
        The store may have removed the listing, or it&apos;s temporarily paused.
      </p>
      <Link href="/" className="inline-block mt-6 underline">
        Back to home
      </Link>
    </main>
  );
}
