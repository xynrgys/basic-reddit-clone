'use client'

import { useState } from 'react'
import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'

export default function CreateSubreddit() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      alert('You must be logged in to create a subreddit')
      return
    }

    // Insert the new subreddit
    const { data, error } = await supabase
      .from('subreddits')
      .insert({ 
        name, 
        description, 
        created_by: user.id
      })

    if (error) {
      console.error('Error creating subreddit:', error)
      alert('Error creating subreddit: ' + error.message)
    } else {
      router.push(`/r/${name}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subreddit name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Create Subreddit</button>
    </form>
  )
}
