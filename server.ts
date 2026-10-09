import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  POPULAR_PLACES_DATA,
  RECOMMENDED_PLACES_DATA,
  CITY_INSIGHTS_DATA,
  SAFETY_INCIDENTS_DATA,
  PRESET_ROUTES,
} from './src/data/cityData';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK (only server-side)
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Compile real city intelligence for system context
const compileCityContext = () => {
  const allPlaces = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA];
  const placesSummary = allPlaces
    .map(
      (p) =>
        `- ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Rating: ${
          p.rating !== undefined ? p.rating : 'None (Rating Pending)'
        } | Price: ${p.price || 'Not listed'} (${p.priceLevel || 'N/A'}) | Distance: ${
          p.distance
        } | Address: ${p.address} | Hours: ${p.hours} | Accessible: ${
          p.accessible ? 'Yes (Step-Free)' : 'No (Steps / Stairs)'
        } | Description: ${p.description}`
    )
    .join('\n');

  const weatherSummary = `Temperature: ${CITY_INSIGHTS_DATA.weather.temperature}${CITY_INSIGHTS_DATA.weather.unit}, Condition: ${CITY_INSIGHTS_DATA.weather.condition}, High: ${CITY_INSIGHTS_DATA.weather.high}°, Low: ${CITY_INSIGHTS_DATA.weather.low}°, Air Quality: ${CITY_INSIGHTS_DATA.weather.airQualityStatus}, Timestamp: ${CITY_INSIGHTS_DATA.weather.lastUpdated}`;

  const trafficSummary = `Status: ${CITY_INSIGHTS_DATA.traffic.status}, Summary: ${CITY_INSIGHTS_DATA.traffic.summary}, Metro: ${CITY_INSIGHTS_DATA.traffic.metroStatus}, Note: ${CITY_INSIGHTS_DATA.traffic.corridorNote}, Source: ${CITY_INSIGHTS_DATA.traffic.lastUpdated}`;

  const safetySummary = SAFETY_INCIDENTS_DATA.map(
    (i) =>
      `- [${i.category}] ${i.title} at ${i.location} | Status: ${i.status} | Verified: ${
        i.isVerified ? 'YES (Municipal Dispatch)' : 'NO (Unverified Community Report)'
      } | Date: ${i.date} | Source: ${i.source} | Description: ${i.description}`
  ).join('\n');

  const routesSummary = PRESET_ROUTES.map(
    (r) =>
      `- Route: "${r.name}" (${r.tag}) | Distance: ${r.distance} | Walk Time: ${
        r.walkTime
      } | Bike Time: ${r.bikeTime} | Lighting: ${r.lightingQuality} | Hazards en route: ${
        r.hazardsEnRoute
      } | Details: ${r.description}`
  ).join('\n');

  return `
CURRENT CITY INTELLIGENCE (San Francisco / Metro District):

1. LIVE VENUES & PLACES:
${placesSummary}

2. CURRENT WEATHER CONDITIONS:
${weatherSummary}

3. URBAN TRANSIT & TRAFFIC FLOW:
${trafficSummary}

4. ACTIVE SAFETY & HAZARD REPORTS:
${safetySummary}

5. VERIFIED URBAN CORRIDOR ROUTES:
${routesSummary}
`;
};

// API Route for AI City Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cityContext = compileCityContext();
    const ai = getAiClient();

    const systemPrompt = `You are CitySense AI, a discerning, perceptive urban intelligence assistant for the city.
You help residents and visitors navigate smarter, discover local gems, understand local conditions, and plan routes.

CRITICAL INSTRUCTIONS:
1. Ground your answers STRICTLY in the provided CURRENT CITY INTELLIGENCE.
2. NEVER invent real incidents, fake prices, arbitrary ratings, or make false claims about weather or traffic.
3. NEVER guarantee that any route or street is completely safe. Always acknowledge that urban conditions can change and reports are advisory.
4. When mentioning or recommending places from the context, include their exact IDs in a bracketed token at the end of your response like:
   [PLACES: pop-1, rec-2]
   This enables the UI to render interactive place cards directly in the chat!
5. For time-sensitive information (weather, community reports, traffic notices), explicitly state the reporting source and timestamp from the context.
6. Format your responses with clean, readable markdown (bolding key names, bullet points where appropriate). Keep answers engaging, concise, and helpful.

${cityContext}`;

    let replyText = '';
    let sources: string[] = ['CitySense Municipal Sensor Hub', 'Civic Data Feed'];

    if (ai) {
      // Build conversation contents for Gemini
      const conversationContents: any[] = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user') {
            conversationContents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'assistant') {
            conversationContents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      conversationContents.push({ role: 'user', parts: [{ text: message }] });

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        replyText = response.text || '';
      } catch (aiErr) {
        console.warn('Gemini API call error, using grounded local fallback:', aiErr);
        replyText = generateFallbackResponse(message);
      }
    } else {
      // Grounded fallback if GEMINI_API_KEY is not yet populated
      replyText = generateFallbackResponse(message);
    }

    // Extract place IDs from the [PLACES: ...] token if present
    const placeMatch = replyText.match(/\[PLACES:\s*([^\]]+)\]/);
    const recommendedPlaceIds: string[] = [];
    if (placeMatch) {
      const ids = placeMatch[1].split(',').map((id) => id.trim());
      recommendedPlaceIds.push(...ids);
      // Clean the token from visible text
      replyText = replyText.replace(/\[PLACES:\s*[^\]]+\]/, '').trim();
    }

    // Add relevant sources based on query content
    const lower = message.toLowerCase();
    if (lower.includes('weather') || lower.includes('temperature') || lower.includes('rain')) {
      sources.push('Local Sensor Hub · 4 mins ago');
    }
    if (lower.includes('traffic') || lower.includes('route') || lower.includes('hazard') || lower.includes('safe')) {
      sources.push('Department of Transportation & Municipal Dispatch · Live');
    }

    return res.json({
      text: replyText,
      recommendedPlaceIds,
      sources,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: 'Failed to process assistant response. Please try again.',
      details: err?.message,
    });
  }
});

// Grounded intelligent fallback responder
function generateFallbackResponse(userMsg: string): string {
  const q = userMsg.toLowerCase();

  if (q.includes('affordable') || q.includes('cheap') || q.includes('budget') || q.includes('food')) {
    return `Here are great affordable dining spots grounded in our local registry:

- **Foundry Roasters & Bakery** ($): Located in Warehouse Row (0.6 km away). Single-origin espresso, warm cardamom buns, and sunlit seating.
- **Aetheria Rooftop Bistro & Lounge** ($$$): Premium seasonal tasting menus with panoramic sunset skyline views.

*Tip: You can filter all venues by exact price tier on the Explore page.*
[PLACES: rec-2, pop-2]`;
  }

  if (q.includes('historic') || q.includes('history') || q.includes('day trip')) {
    return `For a rich historical itinerary, explore these verified heritage landmarks:

- **Old Port Historic Clocktower & Arcade** (Free): Constructed in 1884, featuring audio walking tours, Gothic revival masonry, and artisan stalls in the Old Quarter.
- **North Pier Heritage Maritime Dock** (Free): Restored wooden pier with tall ships and maritime archives overlooking the bay (Note: Historic slipways have step-only access).

*Weather today is 72°F and partly sunny—ideal for an afternoon walking tour.*
[PLACES: pop-3, rec-3]`;
  }

  if (q.includes('hazard') || q.includes('accessible') || q.includes('route') || q.includes('walk')) {
    return `Based on active municipal infrastructure feeds:

- **Primary Illuminated Corridor** (Recommended): 1.8 km (22 mins walk). Follows civic avenues with continuous smart LED lighting and **0 reported hazards**.
- **Notice on 4th St**: An active multi-vehicle collision advisory and pavement repair trench are reported on 4th St. The sidewalk is passable with caution, but pedestrians with mobility aids should use the Primary Corridor bypass.

*Reminder: Conditions can change rapidly. Reported advisories do not guarantee absolute safety; always stay aware of surroundings.*
[PLACES: pop-1, rec-1]`;
  }

  if (q.includes('compare') || q.includes('neighbourhood') || q.includes('district')) {
    return `Here is an urban comparison of two prominent districts:

- **Park District**: Features the **Verdant Biome Conservatory** (4.9 ★) and **Cypress Grove Civic Arboretum**. Characterized by lush canopy walkways, tranquil green spaces, and high pedestrian accessibility.
- **Old Quarter & Waterfront**: Centered around the **Old Port Historic Clocktower** (4.7 ★) and **The Glasshouse Boutique Hotel**. Known for 19th-century architecture, cobblestone arcades, and waterfront promenades.

*Both districts have active street patrols and good connectivity via metro lines (currently running 98.4% on-time).*
[PLACES: pop-1, pop-3, pop-4]`;
  }

  return `I'm your CitySense assistant, connected to the city's live directory, weather hub, and municipal incident feeds.

Current conditions: **72°F, Partly Sunny & Mild** with excellent air quality (AQI 28).

You can ask me to:
- Find affordable food, artisan bakeries, or rooftop lounges
- Suggest historical day trips or nature walks
- Recommend accessible paths avoiding reported hazards
- Compare city districts and local culture

[PLACES: pop-1, pop-2]`;
}

// Start Vite in dev mode or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CitySense AI server running on port ${port}`);
  });
}

startServer();
