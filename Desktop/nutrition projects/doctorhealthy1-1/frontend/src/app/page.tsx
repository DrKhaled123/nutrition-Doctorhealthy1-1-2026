async function fetchHealth() {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  try {
    const res = await fetch(`${apiUrl}/api/v1/health`, { next: { revalidate: 0 } })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    return await res.json()
  } catch (e) {
    return { status: 'error', error: (e as Error).message }
  }
}

export default async function Page() {
  const health = await fetchHealth()
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Trae Nutrition Frontend</h1>
      <p>This Next.js app connects to the Go backend.</p>
      <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(health, null, 2)}
      </pre>
      <p>Backend API URL: {process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
    </main>
  )
}

