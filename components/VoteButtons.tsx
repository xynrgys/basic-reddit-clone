'use client'

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client"

interface VoteButtonsProps {
  postId: string;
  initialVoteCount: number;
}

export default function VoteButtons({ postId, initialVoteCount }: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUserVote();
  }, [postId]);

  const fetchUserVote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('post_votes')
        .select('vote_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (data) setUserVote(data.vote_type);
    }
  };

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
        post_id: postId,
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
      <button onClick={() => handleVote(1)} style={{color: userVote === 1 ? 'orange' : 'inherit'}}>Upvote</button>
      <span>{voteCount}</span>
      <button onClick={() => handleVote(-1)} style={{color: userVote === -1 ? 'blue' : 'inherit'}}>Downvote</button>
    </div>
  );
}
