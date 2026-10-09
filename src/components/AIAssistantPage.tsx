import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  MapPin,
  Star,
  ExternalLink,
  Navigation,
  Compass,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Info,
  DollarSign,
  Accessibility,
  ChevronRight,
} from 'lucide-react';
import {
  POPULAR_PLACES_DATA,
  RECOMMENDED_PLACES_DATA,
  PlaceItem,
} from '../data/cityData';
import { PlaceArt } from './PlaceArt';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedPlaces?: PlaceItem[];
  sources?: string[];
  timestamp: string;
  isError?: boolean;
}

interface AIAssistantPageProps {
  onOpenPlaceDetail: (place: PlaceItem) => void;
  onNavigateToMap: (placeId?: string) => void;
  onNavigateToSafety: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onOpenPlaceDetail,
  onNavigateToMap,
  onNavigateToSafety,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I'm your **CitySense Urban Assistant**, grounded in live local registry records, current weather sensors, transit logs, and verified safety advisories.\n\nAsk me anything about local destinations, accessible routes, dining options, or current district conditions!`,
      sources: ['CitySense Civic Engine', 'Local Sensor Hub'],
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Find affordable food near me.',
    'Suggest historical places for a day trip.',
    'Compare two neighbourhoods.',
    'Find an accessible route avoiding reported hazards.',
  ];

  // Map of all places by ID for quick lookup
  const placesMap = useRef<Map<string, PlaceItem>>(new Map());
  useEffect(() => {
    const map = new Map<string, PlaceItem>();
    [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA].forEach((p) => {
      map.set(p.id, p);
    });
    placesMap.current = map;
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build conversation history payload
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned error code: ${res.status}`);
      }

      const data = await res.json();

      // Resolve recommended places
      const recommendedPlaces: PlaceItem[] = [];
      if (Array.isArray(data.recommendedPlaceIds)) {
        data.recommendedPlaceIds.forEach((id: string) => {
          const place = placesMap.current.get(id);
          if (place) recommendedPlaces.push(place);
        });
      }

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I checked the city registry, but no text was returned.',
        recommendedPlaces: recommendedPlaces.length > 0 ? recommendedPlaces : undefined,
        sources: data.sources || ['Municipal Civic Feed'],
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error communicating with /api/chat:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an issue retrieving real-time data from the server. Please check your connection and try again.`,
        isError: true,
        sources: ['Connection Diagnostic'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Grounded Urban Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Your city, explained
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Direct answers powered by live civic registries, verified safety advisories, and transit monitors
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400">Suggested Questions:</span>
        <div className="flex flex-wrap items-center gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window Frame */}
      <div className="w-full rounded-[36px] bg-black border border-white/15 p-4 sm:p-6 flex flex-col justify-between min-h-[560px] max-h-[720px] shadow-2xl relative overflow-hidden">
        {/* Top Specular Rim */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 no-scrollbar py-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-2.5 max-w-3xl ${
                msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div className="flex items-center gap-2 px-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'glass-blue-btn text-slate-950'
                      : 'bg-white/10 text-blue-300 border border-white/15'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {msg.sender === 'user' ? 'You' : 'CitySense AI'}
                </span>
                <span className="text-[10px] text-slate-500">· {msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 sm:p-5 rounded-[26px] text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'glass-blue-btn text-slate-950 font-medium rounded-tr-sm shadow-md'
                    : msg.isError
                    ? 'bg-red-950/20 border border-red-500/30 text-red-200 rounded-tl-sm'
                    : 'clay-card text-slate-100 rounded-tl-sm'
                }`}
              >
                {/* Parse simple markdown lines */}
                <div className="whitespace-pre-wrap flex flex-col gap-2">
                  {msg.text.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="leading-relaxed">
                      {paragraph.split('**').map((chunk, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className={msg.sender === 'user' ? 'font-black' : 'font-bold text-white'}>
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* Compact Place Cards inside response */}
                {msg.recommendedPlaces && msg.recommendedPlaces.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2.5">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Recommended Places ({msg.recommendedPlaces.length})</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.recommendedPlaces.map((place) => (
                        <div
                          key={place.id}
                          className="p-3 rounded-2xl bg-black/60 border border-white/15 hover:border-white/30 transition-all flex flex-col justify-between gap-2.5"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-slate-900 border border-white/10">
                              <PlaceArt
                                iconType={place.clayIcon}
                                themeColor={place.themeColor}
                                className="min-h-0 h-full rounded-none"
                              />
                            </div>

                            <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                              <span className="text-[10px] font-bold text-blue-300">
                                {place.category}
                              </span>
                              <h4 className="font-bold text-xs text-white truncate">
                                {place.name}
                              </h4>
                              <span className="text-[11px] text-slate-400 truncate">
                                {place.address}
                              </span>

                              <div className="flex items-center gap-2 text-[10px] text-slate-300 pt-0.5">
                                {typeof place.rating === 'number' ? (
                                  <span className="text-amber-300 font-bold flex items-center gap-0.5">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>{place.rating.toFixed(1)}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Rating Pending</span>
                                )}

                                {place.price && (
                                  <>
                                    <span>·</span>
                                    <span>{place.price}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                            <button
                              onClick={() => onOpenPlaceDetail(place)}
                              className="text-blue-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => onNavigateToMap(place.id)}
                              className="text-slate-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <MapPin className="w-3 h-3 text-blue-400" />
                              <span>Show on Map</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources & Timestamps badge */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">Sources:</span>
                    {msg.sources.map((src, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 self-start p-3 rounded-2xl clay-card">
              <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-xs text-slate-300">
                Grounding city response with live local registries...
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-white/10">
          <div className="relative w-full h-[54px] rounded-full glass-tube flex items-center px-4 gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about places, routes, food, or local conditions..."
              disabled={isTyping}
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder-slate-400 focus:ring-0 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 rounded-full glass-blue-btn flex items-center justify-center text-slate-950 font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
