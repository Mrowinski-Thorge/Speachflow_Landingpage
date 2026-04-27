import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://speachflow.app',
  'https://www.speachflow.app',
];

const DAILY_LIMIT = 2;
const COOLDOWN_DAYS = 1;
const MIN_AUDIO_BYTES = 8000;

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
  const origin = req.headers.get('origin') ?? '';

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  } else {
    corsHeaders['Access-Control-Allow-Origin'] = ALLOWED_ORIGINS[0];
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Origin guard
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response(
      JSON.stringify({ error: 'forbidden', message: 'Only requests from speachflow.app are allowed.' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'method_not_allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // API key guard (manual since verify_jwt is false)
  const apiKey = req.headers.get('apikey') ?? '';
  const expectedKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  if (!apiKey || apiKey !== expectedKey) {
    return new Response(
      JSON.stringify({ error: 'missing_authorization', message: 'Missing or invalid apikey header.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── POST: Analyze speech ──
  try {
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

    const missing: string[] = [];
    if (!clientEmail) missing.push('GCP_CLIENT_EMAIL');
    if (!privateKey) missing.push('GCP_PRIVATE_KEY');
    if (!projectId) missing.push('GCP_PROJECT_ID');

    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ error: 'missing_credentials', missing }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const deviceId = formData.get('device_id') as string;
    const sessionId = (formData.get('session_id') as string) ?? '';
    const scenario = (formData.get('scenario') as string) || 'speech';

    // device_id is required
    if (!audioFile || !deviceId) {
      return new Response(
        JSON.stringify({ error: 'Missing audio or device_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Audio length guard
    if (audioFile.size < MIN_AUDIO_BYTES) {
      return new Response(
        JSON.stringify({
          error: 'audio_too_short',
          message: 'Aufnahme nicht lang genug – bitte mindestens 3 Sekunden sprechen.',
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit check – keyed by device_id
    const today = new Date().toISOString().split('T')[0];
    const { data: rateData } = await supabase
      .from('live_test_rate_limit')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    const currentCount = rateData?.used_count ?? 0;
    const cooldownUntil: string | null = rateData?.cooldown_until ?? null;

    if (cooldownUntil && today < cooldownUntil) {
      return new Response(
        JSON.stringify({
          error: 'cooldown_active',
          used: currentCount,
          limit: DAILY_LIMIT,
          cooldown_until: cooldownUntil,
          message: `Du bist im Cooldown. Nächste Analyse möglich ab: ${cooldownUntil}`,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const effectiveCount = (cooldownUntil && today >= cooldownUntil) ? 0 : currentCount;

    if (effectiveCount >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({
          error: 'rate_limit_exceeded',
          used: effectiveCount,
          limit: DAILY_LIMIT,
          message: 'Du hast dein Limit von 2 Analysen erreicht.',
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

    const accessToken = await getGoogleAccessToken(clientEmail!, privateKey!);

    // EU-Region: europe-west3 (Frankfurt)
    const region = 'europe-west3';
    const model = 'gemini-2.5-flash-lite';
    const vertexUrl = `https://europe-west3-aiplatform.googleapis.com/v1/projects/${projectId}/locations/europe-west3/publishers/google/models/${model}:streamGenerateContent`;

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
                text: `Du bist ein erfahrener Präsentationscoach. Analysiere diese Audioaufnahme einer ${scenarioLabel} sehr sorgfältig.

SCHRITT 1 – TRANSKRIPTION:
Transkribiere exakt und vollständig, was gesprochen wurde. Jedes Wort, jede Pause, jeder Satz. Keine Zusammenfassung – wörtlich.

SCHRITT 2 – BEWERTUNG:
Nur wenn die Aufnahme mindestens 3 vollständige gesprochene Sätze enthält UND die Sprache klar erkennbar ist:
- Identifiziere genau 3 konkrete Stärken der Sprechweise (z.B. Tempo, Betonung, Klarheit, Struktur, Überzeugungskraft)
- Identifiziere genau 3 konkrete Schwächen / Verbesserungsbereiche mit praktischem Tipp
- Schreibe GENAU EINEN abschließenden Satz als Gesamtfazit

WICHTIG: Gib KEINEN numerischen Score, KEINE Prozentzahl, KEINE Punktzahl und KEINE Bewertungsskala aus. Kein "Gesamtpunktzahl", kein "Score", keine "Note".

Falls die Sprache nicht erkennbar ist, zu kurz, zu leise oder weniger als 3 vollständige Sätze:
Antworte NUR mit:
{"transcript":"","strengths":[],"improvements":[],"summary":"Zu wenig zum Auswerten – bitte sprich mindestens 3 vollständige Sätze."}

AUSGABE – NUR dieses JSON, kein Markdown, kein erklärender Text davor oder danach:
{
  "transcript": "<vollständige wörtliche Transkription>",
  "strengths": ["<Stärke 1>", "<Stärke 2>", "<Stärke 3>"],
  "improvements": ["<Verbesserung 1 mit konkretem Tipp>", "<Verbesserung 2 mit konkretem Tipp>", "<Verbesserung 3 mit konkretem Tipp>"],
  "summary": "<Genau ein Satz Gesamtfazit>"
}`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
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

    const rawText = await collectStreamedText(geminiResponse);

    let analysis;
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        transcript: '',
        strengths: [],
        improvements: [],
        summary: 'Zu wenig zum Auswerten – bitte sprich mindestens 3 vollständige Sätze.',
      };
    }

    // Update rate limit – keyed by device_id
    const newCount = effectiveCount + 1;
    const isLastAttempt = newCount >= DAILY_LIMIT;

    const cooldownDate = isLastAttempt
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + COOLDOWN_DAYS);
          return d.toISOString().split('T')[0];
        })()
      : null;

    if (rateData && (cooldownUntil === null || today >= cooldownUntil)) {
      await supabase
        .from('live_test_rate_limit')
        .update({
          used_count: newCount,
          last_used_date: today,
          updated_at: new Date().toISOString(),
          ...(cooldownDate ? { cooldown_until: cooldownDate } : {}),
        })
        .eq('device_id', deviceId);
    } else if (!rateData) {
      await supabase
        .from('live_test_rate_limit')
        .insert({
          device_id: deviceId,
          session_id: sessionId || deviceId,
          used_count: newCount,
          last_used_date: today,
          ...(cooldownDate ? { cooldown_until: cooldownDate } : {}),
        });
    }

    return new Response(
      JSON.stringify({
        ...analysis,
        used: newCount,
        limit: DAILY_LIMIT,
        remaining: DAILY_LIMIT - newCount,
        ...(cooldownDate ? { cooldown_until: cooldownDate } : {}),
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
