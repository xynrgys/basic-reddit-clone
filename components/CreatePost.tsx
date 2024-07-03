'use client'

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'

export default function CreatePost({ subredditId, subredditName }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      alert('You must be logged in to create a post')
      return
    }

    // Insert the new post
    const { data, error } = await supabase
      .from('posts')
      .insert({ 
        title,
        content,
        user_id: user.id,
        subreddit_id,
        subreddit_name, // Add subreddit_name here
      })

    if (error) {
      console.error('Error creating post:', error)
      alert('Error creating post: ' + error.message)
    } else {
      router.push(`/r/${subredditName}/posts/${data[0].id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post content"
      />
      <button type="submit">Create Post</button>
    </form>
  )
}
