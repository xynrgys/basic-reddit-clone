'use client'

import CreatePost from '@/components/CreatePost'
import { useSearchParams } from 'next/navigation'

export default function CreatePostClient() {
  const searchParams = useSearchParams()
  const subredditId = searchParams.get('subredditId')
  const subredditName = searchParams.get('subredditName')

  return (
    <CreatePost
      subredditId={subredditId || ''}
      subredditName={subredditName || ''}
    />
  )
}
