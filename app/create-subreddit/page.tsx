'use client'

import CreateSubreddit from '@/components/CreateSubreddit'

export default function CreateSubredditPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Subreddit</h1>
      <CreateSubreddit />
    </div>
  )
}
