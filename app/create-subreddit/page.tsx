// In your app/create-subreddit/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreateSubreddit from '@/components/CreateSubreddit'

export default async function CreateSubredditPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)


  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Create a New Subreddit</h1>
      <CreateSubreddit />
    </div>
  )
}
