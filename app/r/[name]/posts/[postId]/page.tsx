import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Comments from '@/components/Comments'
import VoteButtons from '@/components/VoteButtons'

interface PageProps {
  params: {
    name: string
    postId: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const { name, postId } = params
  const supabase = createClient()

  console.log('Fetching post with:', { name, postId });

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      vote_count:post_votes(sum(vote_type))
    `)
    .eq('id', postId)
    .eq('subreddit_name', name)
    .single()

  console.log('Query result:', { post, error });

  if (error) {
    console.error('Error fetching post:', error);
    notFound()
  }

  if (!post) {
    console.log('No post found');
    notFound()
  }

  // Calculate the vote count
  const voteCount = post.vote_count?.[0]?.sum || 0;

  console.log('Post found:', post);

  return (
    <div>
      <h1>{post.title}</h1>
      <VoteButtons postId={postId} initialVoteCount={voteCount} />
      <p>{post.content}</p>
      {/* Render other post details */}
      <Comments postId={postId} />
    </div>
  )
}
