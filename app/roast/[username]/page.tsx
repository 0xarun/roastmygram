import { RoastDashboard } from "@/components/roast-dashboard"

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function RoastPage({ params }: PageProps) {
  const { username } = await params

  return <RoastDashboard username={username} />
}
