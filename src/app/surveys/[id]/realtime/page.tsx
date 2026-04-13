import AppShell from '@/shared/components/layout/AppShell'
import RealtimeScreen from '@/features/realtime/index'

export default async function RealtimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AppShell>
      <RealtimeScreen surveyId={id} />
    </AppShell>
  )
}
