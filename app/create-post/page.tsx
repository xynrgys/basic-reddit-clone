'use client'

import CreatePost from '@/components/CreatePost'
import { useSearchParams } from 'next/navigation'

export default function CreatePostPage() {
  const searchParams = useSearchParams()
  const subredditId = searchParams.get('subredditId')

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <CreatePost subredditId={subredditId || ''} />
    </div>
  )
}
