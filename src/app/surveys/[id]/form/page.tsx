import PublicFormScreen from '@/features/public-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SurveyFormPage({ params }: PageProps) {
  const { id } = await params
  return <PublicFormScreen surveyId={id} />
}
