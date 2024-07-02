'use client'

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client"
import Link from 'next/link'

interface Subreddit {
  id: string;
  name: string;
  created_at: string;
}

export default function SubredditList() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchSubreddits = async () => {
      const { data, error } = await supabase
        .from('subreddits')
        .select('*')
        .order('created_at', { ascending: false }) // Order by creation time, newest first
        .limit(10) // Limit to 10 most recent subreddits, adjust as needed

      if (error) {
        console.error('Error fetching subreddits:', error)
      } else {
        setSubreddits(data || [])
      }
    }

    fetchSubreddits()
  }, [])

  return (
    <div>
      <h2>Recent Subreddits</h2>
      <ul>
        {subreddits.map((subreddit) => (
          <li key={subreddit.id}>
            <Link href={`/r/${subreddit.name}`}>
              {subreddit.name}
            </Link>
            <span> - Created {new Date(subreddit.created_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
