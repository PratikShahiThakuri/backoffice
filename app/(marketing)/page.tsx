export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-4">ReactiveForm Platform</h1>
      <p className="text-lg text-gray-600 mb-6">Forms for enterprise, multi-tenancy ready.</p>
      <a href="/login" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
        Access Admin Console
      </a>
    </div>
  );
}
