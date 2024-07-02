import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: { id: string };
}

interface Subreddit {
  id: string;
  name: string;
}

interface Subscription {
  subreddits: Subreddit;
}

interface Post {
  id: string;
  title: string;
}

interface Upvote {
  posts: Post;
}

export default async function UserProfile({ params }: PageProps) {
  const supabase = createClient()

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

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <h2>Subscribed Subreddits</h2>
      <ul>
        {subscriptions && subscriptions.length > 0 ? (
          subscriptions.map((sub: Subscription) => (
            <li key={sub.subreddits.id}>{sub.subreddits.name}</li>
          ))
        ) : (
          <li>No subscriptions yet</li>
        )}
      </ul>
      <h2>Upvoted Posts</h2>
      <ul>
        {upvotedPosts && upvotedPosts.length > 0 ? (
          upvotedPosts.map((upvote: Upvote) => (
            <li key={upvote.posts.id}>{upvote.posts.title}</li>
          ))
        ) : (
          <li>No upvoted posts yet</li>
        )}
      </ul>
    </div>
  )
}
