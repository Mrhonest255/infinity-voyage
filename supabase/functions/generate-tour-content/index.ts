import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert travel content writer specializing in Tanzania safaris and Zanzibar excursions. 
    Generate detailed, engaging, and SEO-optimized content for tours and activities.
    Always respond with valid JSON only, no markdown or extra text.`;

    const userPrompt = type === 'safari' 
      ? `Generate complete tour content for a Tanzania safari called "${title}". 
         Return a JSON object with these exact fields:
         {
           "description": "A detailed 200-300 word description of the safari experience",
           "short_description": "A 50-word summary for cards and previews",
           "duration": "e.g., '5 Days / 4 Nights'",
           "price": number (USD, realistic price between 1500-8000),
           "difficulty": "easy" or "moderate" or "challenging",
           "max_group_size": number between 6-16,
           "included": ["array of 6-8 included items like meals, accommodation, transport"],
           "excluded": ["array of 4-5 excluded items like flights, visa, tips"],
           "highlights": ["array of 5-7 tour highlights"],
           "itinerary": [
             {"day": 1, "title": "Day title", "description": "Day description", "activities": ["activity1", "activity2"]}
           ]
         }`
      : `Generate complete activity content for a Zanzibar excursion called "${title}".
         Return a JSON object with these exact fields:
         {
           "description": "A detailed 150-200 word description of the activity",
           "short_description": "A 40-word summary for cards and previews",
           "duration": "e.g., 'Half Day (4-5 hours)' or 'Full Day'",
           "price": number (USD, realistic price between 50-300),
           "location": "specific location in Zanzibar",
           "included": ["array of 4-6 included items"],
           "excluded": ["array of 3-4 excluded items"],
           "highlights": ["array of 4-6 activity highlights"]
         }`;

    console.log(`Generating ${type} content for: ${title}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from AI');
    }

    // Parse the JSON content
    let parsedContent;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    console.log('Successfully generated content');

    return new Response(JSON.stringify({ content: parsedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-tour-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});