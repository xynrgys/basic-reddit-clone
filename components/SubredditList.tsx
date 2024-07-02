'use client';

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client"
import Link from 'next/link'

interface Subreddit {
  id: string;
  name: string;
}

export default function SubredditList() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchSubreddits = async () => {
      const { data, error } = await supabase
        .from('subreddits')
        .select('*')
        .order('name', { ascending: true })

      if (error) console.error('Error fetching subreddits:', error)
      else setSubreddits(data || [])
    }

    fetchSubreddits()
  }, [])

  return (
    <div>
      <h2>Subreddits</h2>
      <ul>
        {subreddits.map((subreddit) => (
          <li key={subreddit.id}>
            <Link href={`/r/${subreddit.name}`}>
              {subreddit.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
