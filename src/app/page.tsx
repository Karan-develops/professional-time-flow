"use client";

import PomodoroTimer from "@/components/PomodoroTimer";
import KanbanBoard from "@/components/KanbanBoard";
import { TimerProvider, useTimerContext } from "@/contexts/TimerContext";
import { Footer } from "@/components/Footer";
import { YourMetrics } from "@/components/YourMetrics";

function AppContent() {
  const { settings } = useTimerContext();

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <main className="flex-grow p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-3xl font-medium text-gray-100 text-center">
            Time Flow Task Manager
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PomodoroTimer />
            <div className="md:col-span-2">
              <KanbanBoard />
            </div>
            {settings.betaFeatures.metrics && (
              <div className="md:col-span-2">
                <YourMetrics />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}
