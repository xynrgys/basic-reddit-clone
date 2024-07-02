'use client';

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client"
import Link from 'next/link'

interface Post {
  id: string;
  title: string;
  content: string;
  subreddit_name: string;
  upvotes: number;
}

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const supabase = createClient()

  const handleUpvote = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('You must be logged in to upvote')
      return
    }

    const { data, error } = await supabase
      .from('upvotes')
      .insert({ post_id: postId, user_id: user.id })

    if (error) {
      console.error('Error upvoting:', error)
    } else {
      // Update post in state to reflect new upvote
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: (post.upvotes || 0) + 1 }
          : post
      ))
    }
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>
            <Link href={`/r/${post.subreddit_name}/comments/${post.id}`}>
              {post.title}
            </Link>
          </h3>
          <p>{post.content}</p>
          <button onClick={() => handleUpvote(post.id)}>
            Upvote ({post.upvotes || 0})
          </button>
        </div>
      ))}
    </div>
  )
}
