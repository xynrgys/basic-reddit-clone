'use client'

import { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client";

export default function SubscribeButton({ subredditId }) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkSubscription()
  }, [subredditId])

  const checkSubscription = async () => {
    const { data: user } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('subreddit_id', subredditId)
      .single()

    if (error) console.error('Error checking subscription:', error)
    else setIsSubscribed(!!data)
  }

  const handleSubscribe = async () => {
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to subscribe')
      return
    }

    if (isSubscribed) {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('subreddit_id', subredditId)

      if (error) console.error('Error unsubscribing:', error)
      else setIsSubscribed(false)
    } else {
      const { error } = await supabase
        .from('subscriptions')
        .insert({ user_id: user.id, subreddit_id: subredditId })

      if (error) console.error('Error subscribing:', error)
      else setIsSubscribed(true)
    }
  }

  return (
    <button onClick={handleSubscribe}>
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  )
}
