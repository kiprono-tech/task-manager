
import TaskManagement from "@/components/TaskManagement";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
      <h1 className="text-4xl font-bold mb-8">Task Manager</h1>
      <TaskManagement />
    </div>
  </main>
  );
}
