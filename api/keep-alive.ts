import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase credentials not configured in environment variables' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    // Ping site_settings or count tours to keep postgres and supabase project active
    const { count, error } = await supabase.from('site_settings').select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase keep-alive ping error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase ping successful - database active',
      timestamp: new Date().toISOString(),
      count,
    });
  } catch (err: any) {
    console.error('Keep-alive exception:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Unknown error' });
  }
}
