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

  // Fetch post details
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('subreddit_name', name)
    .single()

  console.log('Post query result:', { post, postError });

  if (postError) {
    console.error('Error fetching post:', postError);
    notFound()
  }

  if (!post) {
    console.log('No post found');
    notFound()
  }

  // Fetch and sum votes
  const { data: voteData, error: voteError } = await supabase
    .from('post_votes')
    .select('vote_type')
    .eq('post_id', postId)

  console.log('Vote query result:', { voteData, voteError });

  if (voteError) {
    console.error('Error fetching votes:', voteError);
    // You might want to handle this error differently
  }

  // Calculate the vote count
  const voteCount = voteData ? voteData.reduce((sum, vote) => sum + vote.vote_type, 0) : 0;

  console.log('Post found:', post);
  console.log('Vote count:', voteCount);

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
