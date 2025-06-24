import DebugAPI from "@/components/debug-api"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Debugger</h1>
      <DebugAPI />
    </div>
  )
}
