import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function SubredditPage({ params }: { params: { name: string } }) {
  const supabase = createClient()

  const { data: subreddit, error } = await supabase
    .from('subreddits')
    .select('*')
    .eq('name', params.name)
    .single()

  if (error || !subreddit) {
    notFound()
  }

  return (
    <div>
      <h1>{subreddit.name}</h1>
      <p>{subreddit.description}</p>
      {/* Add more subreddit details and functionality here */}
    </div>
  )
}
