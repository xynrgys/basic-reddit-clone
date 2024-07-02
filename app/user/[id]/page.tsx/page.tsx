import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'

export default async function UserProfile({ params }) {
  const supabase = createClient({ cookies })
  
  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('subreddits(*)')
    .eq('user_id', params.id)

  const { data: upvotedPosts } = await supabase
    .from('upvotes')
    .select('posts(*)')
    .eq('user_id', params.id)

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <h2>Subscribed Subreddits</h2>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub.subreddits.id}>{sub.subreddits.name}</li>
        ))}
      </ul>
      <h2>Upvoted Posts</h2>
      <ul>
        {upvotedPosts.map((upvote) => (
          <li key={upvote.posts.id}>{upvote.posts.title}</li>
        ))}
      </ul>
    </div>
  )
}
