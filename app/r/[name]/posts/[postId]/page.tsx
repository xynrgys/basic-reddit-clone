'use client'

import { useState, useEffect } from 'react'
import Comments from '@/components/Comments'  // Adjust this import path as necessary

interface PageProps {
  params: {
    name: string
    postId: string
  }
}

export default function PostPage({ params }: PageProps) {
  const { name, postId } = params
  const [post, setPost] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', postId);
        const response = await fetch(`/api/posts/${postId}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch post: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        console.log('Fetched post data:', data);
        setPost(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };
  
    fetchPost();
  }, [postId]);
  

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Render other post details */}
      <Comments postId={postId} />
    </div>
  )
}
