import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Users, Zap, Eye, Shield } from 'lucide-react';

// Type definitions
interface Star {
  x: number;
  y: number;
  size: number;
  name?: string;
}

interface Constellation {
  name: string;
  stars: Star[];
  lines: number[][];
}

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  glow: string;
}

interface ArcanaCard {
  name: string;
  symbol: string;
  aspect: string;
  power: string;
}

interface MarketReading {
  theme: ArcanaCard;
  signal: string;
  confluence: string;
  days: Record<string, ArcanaCard>;
}

// Real constellation data
const CONSTELLATIONS: Record<string, Constellation> = {
  orion: {
    name: 'Orion',
    stars: [
      { x: 300, y: 100, size: 4, name: 'Betelgeuse' },
      { x: 400, y: 100, size: 3, name: 'Bellatrix' },
      { x: 320, y: 200, size: 2 },
      { x: 350, y: 220, size: 2 },
      { x: 380, y: 200, size: 2 },
      { x: 300, y: 350, size: 3, name: 'Saiph' },
      { x: 400, y: 350, size: 4, name: 'Rigel' }
    ],
    lines: [[0,2], [2,3], [3,4], [4,1], [2,5], [4,6]]
  },
  ursaMajor: {
    name: 'Ursa Major',
    stars: [
      { x: 100, y: 200, size: 2 },
      { x: 150, y: 180, size: 2 },
      { x: 200, y: 190, size: 2 },
      { x: 250, y: 210, size: 2 },
      { x: 240, y: 280, size: 2 },
      { x: 300, y: 300, size: 2 },
      { x: 350, y: 280, size: 2 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [3,6]]
  },
  scorpius: {
    name: 'Scorpius',
    stars: [
      { x: 550, y: 50, size: 2 },
      { x: 520, y: 100, size: 2 },
      { x: 500, y: 150, size: 2 },
      { x: 480, y: 200, size: 4, name: 'Antares' },
      { x: 460, y: 250, size: 2 },
      { x: 440, y: 300, size: 2 },
      { x: 420, y: 350, size: 2 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
  }
};

// Animated constellation background
const ConstellationBackground: React.FC<{ theme: ColorTheme }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    brightness: number;
    twinkleSpeed: number;
  }>>([]);
  const shootingStarsRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    opacity: number;
    active: boolean;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Initialize background stars
    starsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      brightness: Math.random(),
      twinkleSpeed: 0.02 + Math.random() * 0.03
    }));

    // Initialize shooting stars
    const createShootingStar = () => ({
      x: Math.random() * canvas.width,
      y: -50,
      vx: -1 - Math.random() * 2,
      vy: 2 + Math.random() * 3,
      length: 50 + Math.random() * 50,
      opacity: 1,
      active: true
    });

    const animate = () => {
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars with twinkling
      starsRef.current.forEach((star: {
        x: number;
        y: number;
        size: number;
        brightness: number;
        twinkleSpeed: number;
      }) => {
        const twinkle = Math.sin(frameRef.current * star.twinkleSpeed) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw constellations
      Object.values(CONSTELLATIONS).forEach((constellation: Constellation) => {
        // Draw constellation lines
        ctx.strokeStyle = theme.glow + '30';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        
        constellation.lines.forEach((line: number[]) => {
          const [start, end] = line;
          const startStar = constellation.stars[start];
          const endStar = constellation.stars[end];
          
          ctx.beginPath();
          ctx.moveTo(startStar.x, startStar.y);
          ctx.lineTo(endStar.x, endStar.y);
          ctx.stroke();
        });
        
        ctx.setLineDash([]);

        // Draw constellation stars
        constellation.stars.forEach((star: Star) => {
          // Star glow
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          gradient.addColorStop(0, theme.glow + '60');
          gradient.addColorStop(0.5, theme.glow + '20');
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();

          // Star core
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();

          // Star label
          if (star.name) {
            ctx.fillStyle = theme.text + '40';
            ctx.font = '10px monospace';
            ctx.fillText(star.name, star.x + 8, star.y - 5);
          }
        });
      });

      // Add shooting stars occasionally
      if (Math.random() < 0.01 && shootingStarsRef.current.length < 3) {
        shootingStarsRef.current.push(createShootingStar());
      }

      // Draw and update shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star: {
        x: number;
        y: number;
        vx: number;
        vy: number;
        length: number;
        opacity: number;
        active: boolean;
      }) => {
        if (!star.active) return false;

        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.vx * star.length, star.y - star.vy * star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * star.length, star.y - star.vy * star.length);
        ctx.stroke();

        // Update position
        star.x += star.vx;
        star.y += star.vy;
        star.opacity *= 0.98;

        // Check if still visible
        if (star.opacity < 0.01 || star.y > canvas.height + 50) {
          star.active = false;
        }

        return star.active;
      });

      frameRef.current++;
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

// Floating zodiac animations
const FloatingElements: React.FC<{ theme: ColorTheme }> = ({ theme }) => {
  const elements = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((symbol, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-20"
          style={{
            color: theme.glow,
            left: `${10 + (i % 6) * 15}%`,
            animation: `float ${20 + i * 2}s linear infinite`,
            animationDelay: `${i * 2}s`
          }}
        >
          {symbol}
        </div>
      ))}
      <style>{`
        @keyframes float {
          from {
            transform: translateY(100vh) rotate(0deg);
          }
          to {
            transform: translateY(-100px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const TarotTraderApp: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('obsidian');
  const [currentDate] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const colorThemes: Record<string, ColorTheme> = {
    obsidian: {
      primary: '#DC2626',
      secondary: '#991B1B',
      accent: '#F59E0B',
      background: '#0A0A0A',
      surface: '#1C1C1C',
      card: '#262626',
      text: '#FAFAFA',
      textSecondary: '#A3A3A3',
      border: '#404040',
      glow: '#DC2626'
    },
    voidsteel: {
      primary: '#1E40AF',
      secondary: '#1E3A8A',
      accent: '#3B82F6',
      background: '#050B1A',
      surface: '#0F1729',
      card: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#334155',
      glow: '#1E40AF'
    },
    nethergold: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#F59E0B',
      background: '#0C0A06',
      surface: '#1C1917',
      card: '#292524',
      text: '#FAFAF9',
      textSecondary: '#A8A29E',
      border: '#44403C',
      glow: '#D97706'
    },
    shadowmage: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#A855F7',
      background: '#0F0A1A',
      surface: '#1F1629',
      card: '#2D1B3D',
      text: '#FAF7FF',
      textSecondary: '#C4B5FD',
      border: '#4C1D95',
      glow: '#7C3AED'
    }
  };

  const theme = colorThemes[selectedTheme];

  const arcana: ArcanaCard[] = [
    { name: 'THE FOOL', symbol: '◈', aspect: 'RISK', power: 'CHAOS' },
    { name: 'THE MAGICIAN', symbol: '⟐', aspect: 'CONTROL', power: 'MANIPULATION' },
    { name: 'HIGH PRIESTESS', symbol: '◉', aspect: 'HIDDEN', power: 'KNOWLEDGE' },
    { name: 'THE EMPRESS', symbol: '♦', aspect: 'GROWTH', power: 'ABUNDANCE' },
    { name: 'THE EMPEROR', symbol: '▲', aspect: 'ORDER', power: 'DOMINION' },
    { name: 'HIEROPHANT', symbol: '⟐', aspect: 'SYSTEM', power: 'STRUCTURE' },
    { name: 'THE LOVERS', symbol: '◈', aspect: 'CHOICE', power: 'UNITY' },
    { name: 'THE CHARIOT', symbol: '▣', aspect: 'DRIVE', power: 'VICTORY' },
    { name: 'STRENGTH', symbol: '◐', aspect: 'FORCE', power: 'WILL' },
    { name: 'THE HERMIT', symbol: '◯', aspect: 'SEARCH', power: 'WISDOM' },
    { name: 'WHEEL FORTUNE', symbol: '◎', aspect: 'FATE', power: 'CYCLES' },
    { name: 'JUSTICE', symbol: '⟐', aspect: 'BALANCE', power: 'LAW' },
    { name: 'HANGED MAN', symbol: '◈', aspect: 'SACRIFICE', power: 'INSIGHT' },
    { name: 'DEATH', symbol: '◆', aspect: 'END', power: 'REBIRTH' },
    { name: 'TEMPERANCE', symbol: '◉', aspect: 'MERGE', power: 'ALCHEMY' },
    { name: 'THE DEVIL', symbol: '▼', aspect: 'BIND', power: 'TEMPTATION' },
    { name: 'THE TOWER', symbol: '⟐', aspect: 'DESTROY', power: 'REVELATION' },
    { name: 'THE STAR', symbol: '✦', aspect: 'HOPE', power: 'GUIDANCE' },
    { name: 'THE MOON', symbol: '◐', aspect: 'ILLUSION', power: 'MYSTERY' },
    { name: 'THE SUN', symbol: '◉', aspect: 'TRUTH', power: 'VITALITY' },
    { name: 'JUDGEMENT', symbol: '▲', aspect: 'VERDICT', power: 'AWAKENING' },
    { name: 'THE WORLD', symbol: '◎', aspect: 'COMPLETE', power: 'MASTERY' }
  ];

  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  const [stockReadings, setStockReadings] = useState<MarketReading>({
    theme: arcana[16],
    signal: 'RISING',
    confluence: 'STRONG',
    days: weekdays.reduce((acc, day) => ({ ...acc, [day]: arcana[Math.floor(Math.random() * arcana.length)] }), {})
  });

  const [cryptoReadings, setCryptoReadings] = useState<MarketReading>({
    theme: arcana[18],
    signal: 'FALLING',
    confluence: 'VOLATILE',
    days: weekdays.reduce((acc, day) => ({ ...acc, [day]: arcana[Math.floor(Math.random() * arcana.length)] }), {})
  });

  const generateReadings = () => {
    const stockDays: Record<string, ArcanaCard> = {};
    const cryptoDays: Record<string, ArcanaCard> = {};
    
    weekdays.forEach(day => {
      stockDays[day] = arcana[Math.floor(Math.random() * arcana.length)];
      cryptoDays[day] = arcana[Math.floor(Math.random() * arcana.length)];
    });

    const signals = ['RISING', 'FALLING', 'VOLATILE', 'STAGNANT'];
    const confluences = ['WEAK', 'MODERATE', 'STRONG', 'ABSOLUTE'];

    setStockReadings({
      theme: arcana[Math.floor(Math.random() * arcana.length)],
      signal: signals[Math.floor(Math.random() * signals.length)],
      confluence: confluences[Math.floor(Math.random() * confluences.length)],
      days: stockDays
    });

    setCryptoReadings({
      theme: arcana[Math.floor(Math.random() * arcana.length)],
      signal: signals[Math.floor(Math.random() * signals.length)],
      confluence: confluences[Math.floor(Math.random() * confluences.length)],
      days: cryptoDays
    });
  };

  const handleGenerateReading = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    generateReadings();
    setIsGenerating(false);
  };

  const getSignalColor = (signal: string) => {
    switch(signal) {
      case 'RISING': return '#10B981';
      case 'FALLING': return '#EF4444';
      case 'VOLATILE': return '#F59E0B';
      case 'STAGNANT': return '#6B7280';
      default: return theme.textSecondary;
    }
  };

  const getConfluenceIntensity = (confluence: string) => {
    switch(confluence) {
      case 'WEAK': return '25%';
      case 'MODERATE': return '50%';
      case 'STRONG': return '75%';
      case 'ABSOLUTE': return '100%';
      default: return '0%';
    }
  };

  interface ArcanaCardProps {
    card: ArcanaCard | null;
    size?: 'standard' | 'large';
    showDetails?: boolean;
    index?: number;
  }

  const ArcanaCard: React.FC<ArcanaCardProps> = ({ card, size = 'standard', showDetails = false, index = 0 }) => {
    if (!card) return null;

    const sizeClasses: Record<string, string> = {
      standard: 'w-16 h-24',
      large: 'w-20 h-32'
    };

    const isHovered = hoveredCard === `${card.name}-${index}`;

    return (
      <div 
        className={`${sizeClasses[size]} rounded border-2 p-3 transition-all duration-500 group relative cursor-pointer transform-gpu`}
        style={{
          background: `linear-gradient(135deg, ${theme.card}00, ${theme.card}FF)`,
          borderColor: theme.border,
          boxShadow: isHovered ? `0 0 30px ${theme.glow}60` : `0 0 20px ${theme.glow}30`,
          transform: isHovered ? 'scale(1.05) translateY(-5px)' : 'scale(1)',
          animation: `cardFloat ${3 + index * 0.2}s ease-in-out infinite`,
          animationDelay: `${index * 0.1}s`
        }}
        onMouseEnter={() => setHoveredCard(`${card.name}-${index}`)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div 
          className="absolute inset-0 rounded opacity-20 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${theme.glow}20, transparent)`,
            opacity: isHovered ? 0.4 : 0.2
          }}
        />
        
        <div className="relative z-10 h-full flex flex-col justify-between items-center">
          <div 
            className="text-xs font-bold text-center tracking-wider leading-tight"
            style={{color: theme.text}}
          >
            {card.name}
          </div>
          
          <div 
            className="text-2xl font-bold"
            style={{
              color: theme.glow,
              animation: 'symbolPulse 4s ease-in-out infinite'
            }}
          >
            {card.symbol}
          </div>
          
          <div 
            className="text-xs opacity-60 text-center"
            style={{color: theme.textSecondary}}
          >
            {card.aspect}
          </div>
        </div>

        {showDetails && (
          <div 
            className={`absolute -top-16 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded border whitespace-nowrap z-20 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
              boxShadow: `0 4px 20px ${theme.glow}40`
            }}
          >
            <div className="text-xs font-bold">{card.power}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{backgroundColor: theme.background}}>
      <ConstellationBackground theme={theme} />
      <FloatingElements theme={theme} />
      
      {/* Animated nebula core */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.glow}20, transparent 70%)`,
          animation: 'nebulaPulse 8s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes symbolPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes nebulaPulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.5; 
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px ${theme.glow}40; }
          50% { box-shadow: 0 0 40px ${theme.glow}60; }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        <header className="mb-12" style={{ animation: 'slideInUp 0.8s ease-out' }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 
                className="text-5xl font-bold mb-3 tracking-wider"
                style={{
                  color: theme.text,
                  textShadow: `0 0 20px ${theme.glow}60`,
                  animation: 'glowPulse 3s ease-in-out infinite'
                }}
              >
                TAROT TRADER
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-px w-16" style={{backgroundColor: theme.glow}} />
                <p className="text-sm font-medium tracking-widest uppercase" style={{color: theme.textSecondary}}>
                  MARKET DOMINION PROTOCOL
                </p>
                <div className="h-px w-16" style={{backgroundColor: theme.glow}} />
              </div>
            </div>
            
            <div className="flex gap-3">
              {(Object.entries(colorThemes) as Array<[string, ColorTheme]>).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`w-8 h-8 rounded border-2 transition-all duration-300 transform hover:scale-110 ${
                    selectedTheme === key ? 'ring-2 ring-white ring-opacity-70' : ''
                  }`}
                  style={{
                    backgroundColor: themeData.glow,
                    borderColor: themeData.accent,
                    boxShadow: `0 0 15px ${themeData.glow}60`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 rounded border-2 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                boxShadow: `inset 0 0 20px ${theme.glow}20`,
                animation: 'slideInLeft 0.6s ease-out'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6" style={{color: theme.glow}} />
                    <span className="font-bold tracking-wider" style={{color: theme.text}}>EQUITIES</span>
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-sm font-bold"
                    style={{
                      backgroundColor: getSignalColor(stockReadings.signal) + '20',
                      color: getSignalColor(stockReadings.signal),
                      border: `1px solid ${getSignalColor(stockReadings.signal)}40`,
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  >
                    {stockReadings.signal}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{color: theme.textSecondary}}>CONFLUENCE</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full" style={{backgroundColor: theme.border}}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: getConfluenceIntensity(stockReadings.confluence),
                          backgroundColor: theme.glow
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{color: theme.glow}}>
                      {stockReadings.confluence}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded border-2 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                boxShadow: `inset 0 0 20px ${theme.glow}20`,
                animation: 'slideInUp 0.6s ease-out 0.2s both'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6" style={{color: '#F59E0B'}} />
                    <span className="font-bold tracking-wider" style={{color: theme.text}}>CRYPTO</span>
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-sm font-bold"
                    style={{
                      backgroundColor: getSignalColor(cryptoReadings.signal) + '20',
                      color: getSignalColor(cryptoReadings.signal),
                      border: `1px solid ${getSignalColor(cryptoReadings.signal)}40`,
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  >
                    {cryptoReadings.signal}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{color: theme.textSecondary}}>CONFLUENCE</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full" style={{backgroundColor: theme.border}}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: getConfluenceIntensity(cryptoReadings.confluence),
                          backgroundColor: '#F59E0B'
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{color: '#F59E0B'}}>
                      {cryptoReadings.confluence}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded border-2 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                boxShadow: `inset 0 0 20px ${theme.glow}20`,
                animation: 'slideInRight 0.6s ease-out 0.4s both'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6" style={{color: theme.glow}} />
                  <span className="font-bold tracking-wider" style={{color: theme.text}}>TEMPORAL</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{color: theme.textSecondary}}>CYCLE</span>
                    <span style={{color: theme.text}}>{currentDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{color: theme.textSecondary}}>PHASE</span>
                    <span style={{color: theme.text}}>WANING ◐</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{color: theme.textSecondary}}>SIGN</span>
                    <span style={{color: theme.text}}>SCORPIO ♏</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Generate Reading Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleGenerateReading}
            disabled={isGenerating}
            className="px-8 py-4 rounded border-2 font-bold tracking-wider transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.primary,
              borderColor: theme.accent,
              color: theme.text,
              boxShadow: `0 0 20px ${theme.glow}40`,
            }}
          >
            {isGenerating ? 'CHANNELING...' : 'GENERATE NEW READING'}
          </button>
        </div>

        {/* Weekly Arcana Spreads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Stock Market Spread */}
          <div 
            className="p-8 rounded border-2 relative"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInLeft 0.8s ease-out 0.6s both'
            }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8" style={{color: theme.glow}} />
                <h3 className="text-2xl font-bold" style={{color: theme.text}}>
                  EQUITY ARCANA
                </h3>
              </div>
              <div className="mb-6">
                <ArcanaCard 
                  card={stockReadings.theme} 
                  size="large" 
                  showDetails={true}
                  index={0}
                />
                <div className="mt-3 text-center">
                  <span className="text-sm font-bold tracking-wider" style={{color: theme.glow}}>
                    WEEKLY THEME
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {weekdays.map((day, i) => (
                <div key={day} className="text-center">
                  <div className="text-xs font-bold mb-2 tracking-wider" style={{color: theme.textSecondary}}>
                    {day}
                  </div>
                  <ArcanaCard 
                    card={stockReadings.days[day]} 
                    showDetails={true}
                    index={i + 1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Crypto Spread */}
          <div 
            className="p-8 rounded border-2 relative"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInRight 0.8s ease-out 0.8s both'
            }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Zap className="w-8 h-8" style={{color: '#F59E0B'}} />
                <h3 className="text-2xl font-bold" style={{color: theme.text}}>
                  CRYPTO ARCANA
                </h3>
              </div>
              <div className="mb-6">
                <ArcanaCard 
                  card={cryptoReadings.theme} 
                  size="large" 
                  showDetails={true}
                  index={10}
                />
                <div className="mt-3 text-center">
                  <span className="text-sm font-bold tracking-wider" style={{color: '#F59E0B'}}>
                    WEEKLY THEME
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {weekdays.map((day, i) => (
                <div key={day} className="text-center">
                  <div className="text-xs font-bold mb-2 tracking-wider" style={{color: theme.textSecondary}}>
                    {day}
                  </div>
                  <ArcanaCard 
                    card={cryptoReadings.days[day]} 
                    showDetails={true}
                    index={i + 11}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotTraderApp;