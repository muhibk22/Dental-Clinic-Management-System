import { HealthCheckResponse } from "@dcms/shared";

async function getHealth(): Promise<HealthCheckResponse> {
  try {
    const res = await fetch("http://localhost:4000/health", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch health: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    return {
      status: "error",
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-8">DCMS Monorepo Health Check</h1>

        <div className={`p-6 rounded-lg border ${health.status === 'ok' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
          <h2 className="text-2xl font-semibold mb-2">API Status: {health.status.toUpperCase()}</h2>
          <p>Message: {health.message}</p>
          <p className="text-xs opacity-75 mt-2">Timestamp: {health.timestamp}</p>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded text-black">
          <p>Frontend: apps/web (Next.js 14)</p>
          <p>Backend: apps/api (Nest.js 11) running on port 4000</p>
          <p>Shared: packages/shared (Types)</p>
        </div>
      </div>
    </main>
  );
}
