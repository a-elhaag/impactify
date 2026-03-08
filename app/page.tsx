import URLCleaner from "./components/URLCleaner";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black font-sans py-12">
      <URLCleaner />
    </div>
  );
}
