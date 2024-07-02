'use client'

import { useSearchParams } from 'next/navigation'
import CreatePost from '@/components/CreatePost'

export default function CreatePostClient() {
  const searchParams = useSearchParams()
  const subredditId = searchParams.get('subredditId')

  return <CreatePost subredditId={subredditId || ''} />
}
