import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DAILY_LIMIT = 2;

async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600;

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now,
  };

  const encodeB64Url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const headerB64 = encodeB64Url(header);
  const payloadB64 = encodeB64Url(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  const pemContents = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signingInput}.${signatureB64}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    throw new Error(`OAuth2 token exchange failed: ${err}`);
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(`No access_token in response: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function collectStreamedText(response: Response): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
  }

  let fullText = '';

  try {
    const parsed = JSON.parse(buffer);
    if (Array.isArray(parsed)) {
      for (const chunk of parsed) {
        const part = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (part) fullText += part;
      }
    } else {
      fullText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }
  } catch {
    const lines = buffer.split('\n').filter((l) => l.trim().startsWith('{'));
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        const part = obj?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (part) fullText += part;
      } catch { /* skip */ }
    }
    if (!fullText) fullText = buffer;
  }

  return fullText;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Try all possible secret name variants
    const clientEmail =
      Deno.env.get('GCP_CLIENT_EMAIL') ??
      Deno.env.get('GOOGLE_CLIENT_EMAIL') ??
      Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');

    const rawPrivateKey =
      Deno.env.get('GCP_PRIVATE_KEY') ??
      Deno.env.get('GOOGLE_PRIVATE_KEY') ??
      Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

    const projectId =
      Deno.env.get('GCP_PROJECT_ID') ??
      Deno.env.get('GOOGLE_PROJECT_ID') ??
      Deno.env.get('GOOGLE_CLOUD_PROJECT');

    const privateKey = rawPrivateKey?.replace(/\\n/g, '\n');

    // Detailed credential diagnostics
    const missing: string[] = [];
    if (!clientEmail) missing.push('GCP_CLIENT_EMAIL (or GOOGLE_CLIENT_EMAIL)');
    if (!privateKey) missing.push('GCP_PRIVATE_KEY (or GOOGLE_PRIVATE_KEY)');
    if (!projectId) missing.push('GCP_PROJECT_ID (or GOOGLE_PROJECT_ID)');

    if (missing.length > 0) {
      console.error('Missing secrets:', missing.join(', '));
      return new Response(
        JSON.stringify({
          error: 'missing_credentials',
          missing,
          message: `Missing Supabase Edge Function secrets: ${missing.join(', ')}. Go to Supabase Dashboard → Edge Functions → Secrets and add them.`,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const sessionId = formData.get('session_id') as string;
    const scenario = (formData.get('scenario') as string) || 'speech';

    if (!audioFile || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing audio or session_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit check
    const today = new Date().toISOString().split('T')[0];
    const { data: rateData } = await supabase
      .from('live_test_rate_limit')
      .select('*')
      .eq('session_id', sessionId)
      .eq('last_used_date', today)
      .maybeSingle();

    const currentCount = rateData?.used_count ?? 0;

    if (currentCount >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({
          error: 'rate_limit_exceeded',
          used: currentCount,
          limit: DAILY_LIMIT,
          message: 'Du hast dein tägliches Limit von 2 Analysen erreicht.',
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Audio → base64
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);
    let binary = '';
    for (let i = 0; i < audioBytes.byteLength; i++) {
      binary += String.fromCharCode(audioBytes[i]);
    }
    const base64Audio = btoa(binary);
    const mimeType = audioFile.type || 'audio/webm';

    const scenarioLabels: Record<string, string> = {
      pitch: 'Startup Pitch',
      presentation: 'Präsentation',
      interview: 'Vorstellungsgespräch',
      speech: 'Rede / Vortrag',
    };
    const scenarioLabel = scenarioLabels[scenario] || 'Vortrag';

    // Step 1: Get OAuth2 token
    console.log('Requesting Google access token for:', clientEmail?.substring(0, 20) + '...');
    const accessToken = await getGoogleAccessToken(clientEmail!, privateKey!);
    console.log('Access token obtained');

    // Step 2: Build URL
    const region = 'us-central1';
    const model = 'gemini-2.5-flash-lite';
    const vertexUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}:streamGenerateContent`;
    console.log('Calling:', vertexUrl);

    // Step 3: POST to Vertex AI
    const geminiResponse = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                inline_data: { mime_type: mimeType, data: base64Audio },
              },
              {
                text: `Du bist ein professioneller Präsentationscoach. Analysiere diese Audioaufnahme einer ${scenarioLabel}.

Antworte NUR mit einem validen JSON-Objekt (keine Markdown-Blöcke, kein Text davor oder danach):

{
  "transcript": "Vollständige Transkription",
  "overall_score": 75,
  "strengths": ["Stärke 1", "Stärke 2", "Stärke 3"],
  "improvements": ["Verbesserung 1", "Verbesserung 2", "Verbesserung 3"],
  "summary": "2-3 Sätze Zusammenfassung mit konkreten Tipps"
}

Regeln:
- overall_score: 0-100, realistisch bewerten
- Immer genau 3 Stärken und 3 Verbesserungen
- Auf Deutsch antworten`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Vertex AI error:', geminiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: 'Vertex AI error', status: geminiResponse.status, details: errText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 4: Parse stream
    const rawText = await collectStreamedText(geminiResponse);
    console.log('Raw response length:', rawText.length);

    let analysis;
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed:', rawText.substring(0, 300));
      analysis = {
        transcript: rawText || 'Transkription nicht verfügbar',
        overall_score: 70,
        strengths: ['Guter Versuch', 'Klare Aussprache', 'Engagement spürbar'],
        improvements: ['Struktur verbessern', 'Pausen bewusster setzen', 'Tempo variieren'],
        summary: 'Eine solide Präsentation mit Entwicklungspotenzial. Weiter üben!',
      };
    }

    // Update rate limit
    if (rateData) {
      await supabase
        .from('live_test_rate_limit')
        .update({ used_count: currentCount + 1, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .eq('last_used_date', today);
    } else {
      await supabase
        .from('live_test_rate_limit')
        .insert({ session_id: sessionId, used_count: 1, last_used_date: today });
    }

    const newCount = currentCount + 1;

    return new Response(
      JSON.stringify({
        ...analysis,
        used: newCount,
        limit: DAILY_LIMIT,
        remaining: DAILY_LIMIT - newCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
