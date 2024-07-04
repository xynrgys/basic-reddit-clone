'use client'

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client"
import Comments from './Comments'

interface PostContentProps {
  post: {
    id: string;
    title: string;
    content: string;
    voteCount: number;
  }
}

export default function PostContent({ post }: PostContentProps) {
  const [voteCount, setVoteCount] = useState(post.voteCount);
  const [userVote, setUserVote] = useState<number | null>(null);
  const supabase = createClient();

  const handleVote = async (voteType: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to vote');
      return;
    }

    const { data, error } = await supabase
      .from('post_votes')
      .upsert({
        user_id: user.id,
        post_id: post.id,
        vote_type: userVote === voteType ? 0 : voteType
      }, {
        onConflict: 'user_id,post_id'
      });

    if (error) {
      console.error('Error voting:', error);
      return;
    }

    // Update local state
    setUserVote(prevVote => prevVote === voteType ? null : voteType);
    setVoteCount(prevCount => prevCount + (userVote === voteType ? -voteType : (userVote ? 2 * voteType : voteType)));
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <div>
        <button onClick={() => handleVote(1)} style={{color: userVote === 1 ? 'orange' : 'inherit'}}>Upvote</button>
        <span>{voteCount}</span>
        <button onClick={() => handleVote(-1)} style={{color: userVote === -1 ? 'blue' : 'inherit'}}>Downvote</button>
      </div>
      <p>{post.content}</p>
      {/* Render other post details */}
      <Comments postId={post.id} />
    </div>
  )
}
