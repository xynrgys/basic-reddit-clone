'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subreddit_id: string;
  created_at: string;
}

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content.substring(0, 100)}...</p>
          <Link href={`/r/${post.subreddit_id}/posts/${post.id}`}>
            Read more
          </Link>
        </div>
      ))}
    </div>
  )
}
