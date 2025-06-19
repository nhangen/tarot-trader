import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Users, Zap, Eye, Shield, Globe, Compass, Star, Moon, Sun, Activity } from 'lucide-react';

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

// Enhanced astronomical data structures
interface RealStar {
  x: number;
  y: number;
  magnitude: number; // Apparent magnitude (brightness)
  spectralClass: string; // O, B, A, F, G, K, M
  name?: string;
  catalogId?: string;
  constellation: string;
  rightAscension: number; // RA in hours
  declination: number; // Dec in degrees
}

interface ConstellationData {
  name: string;
  abbreviation: string;
  stars: RealStar[];
  lines: number[][];
  mythology?: string;
  season: string; // When best visible
}

// Real astronomical star catalog data with proper coordinates and magnitudes
const STAR_CATALOG: Record<string, ConstellationData> = {
  orion: {
    name: 'Orion',
    abbreviation: 'Ori',
    mythology: 'The Hunter',
    season: 'Winter',
    stars: [
      { x: 0, y: 0, magnitude: 0.45, spectralClass: 'M1', name: 'Betelgeuse', catalogId: 'α Ori', constellation: 'Orion', rightAscension: 5.92, declination: 7.41 },
      { x: 0, y: 0, magnitude: 1.64, spectralClass: 'B2', name: 'Bellatrix', catalogId: 'γ Ori', constellation: 'Orion', rightAscension: 5.42, declination: 6.35 },
      { x: 0, y: 0, magnitude: 2.23, spectralClass: 'O9', name: 'Mintaka', catalogId: 'δ Ori', constellation: 'Orion', rightAscension: 5.53, declination: -0.30 },
      { x: 0, y: 0, magnitude: 1.69, spectralClass: 'O9', name: 'Alnilam', catalogId: 'ε Ori', constellation: 'Orion', rightAscension: 5.60, declination: -1.20 },
      { x: 0, y: 0, magnitude: 1.74, spectralClass: 'O9', name: 'Alnitak', catalogId: 'ζ Ori', constellation: 'Orion', rightAscension: 5.68, declination: -1.94 },
      { x: 0, y: 0, magnitude: 2.07, spectralClass: 'B0', name: 'Saiph', catalogId: 'κ Ori', constellation: 'Orion', rightAscension: 5.80, declination: -9.67 },
      { x: 0, y: 0, magnitude: 0.18, spectralClass: 'B8', name: 'Rigel', catalogId: 'β Ori', constellation: 'Orion', rightAscension: 5.24, declination: -8.20 },
      { x: 0, y: 0, magnitude: 3.39, spectralClass: 'K2', name: 'Tabit', catalogId: 'π³ Ori', constellation: 'Orion', rightAscension: 4.83, declination: 6.96 }
    ],
    lines: [[0,1], [1,3], [3,2], [2,4], [4,3], [3,6], [6,5], [5,0], [0,7]]
  },
  ursaMajor: {
    name: 'Ursa Major',
    abbreviation: 'UMa',
    mythology: 'The Great Bear',
    season: 'Spring',
    stars: [
      { x: 0, y: 0, magnitude: 1.85, spectralClass: 'K0', name: 'Dubhe', catalogId: 'α UMa', constellation: 'Ursa Major', rightAscension: 11.06, declination: 61.75 },
      { x: 0, y: 0, magnitude: 2.34, spectralClass: 'A0', name: 'Merak', catalogId: 'β UMa', constellation: 'Ursa Major', rightAscension: 11.03, declination: 56.38 },
      { x: 0, y: 0, magnitude: 2.41, spectralClass: 'A0', name: 'Phecda', catalogId: 'γ UMa', constellation: 'Ursa Major', rightAscension: 11.90, declination: 53.69 },
      { x: 0, y: 0, magnitude: 3.32, spectralClass: 'A3', name: 'Megrez', catalogId: 'δ UMa', constellation: 'Ursa Major', rightAscension: 12.26, declination: 57.03 },
      { x: 0, y: 0, magnitude: 1.76, spectralClass: 'B3', name: 'Alioth', catalogId: 'ε UMa', constellation: 'Ursa Major', rightAscension: 12.90, declination: 55.96 },
      { x: 0, y: 0, magnitude: 2.23, spectralClass: 'A0', name: 'Mizar', catalogId: 'ζ UMa', constellation: 'Ursa Major', rightAscension: 13.42, declination: 54.93 },
      { x: 0, y: 0, magnitude: 1.85, spectralClass: 'B3', name: 'Alkaid', catalogId: 'η UMa', constellation: 'Ursa Major', rightAscension: 13.79, declination: 49.31 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
  },
  scorpius: {
    name: 'Scorpius',
    abbreviation: 'Sco',
    mythology: 'The Scorpion',
    season: 'Summer',
    stars: [
      { x: 0, y: 0, magnitude: 1.06, spectralClass: 'M1', name: 'Antares', catalogId: 'α Sco', constellation: 'Scorpius', rightAscension: 16.49, declination: -26.43 },
      { x: 0, y: 0, magnitude: 2.56, spectralClass: 'B1', name: 'Graffias', catalogId: 'β¹ Sco', constellation: 'Scorpius', rightAscension: 16.09, declination: -19.81 },
      { x: 0, y: 0, magnitude: 2.29, spectralClass: 'B2', name: 'Dschubba', catalogId: 'δ Sco', constellation: 'Scorpius', rightAscension: 16.00, declination: -22.62 },
      { x: 0, y: 0, magnitude: 2.89, spectralClass: 'K2', name: 'Sargas', catalogId: 'θ Sco', constellation: 'Scorpius', rightAscension: 17.62, declination: -42.99 },
      { x: 0, y: 0, magnitude: 1.86, spectralClass: 'B0', name: 'Shaula', catalogId: 'λ Sco', constellation: 'Scorpius', rightAscension: 17.56, declination: -37.10 },
      { x: 0, y: 0, magnitude: 2.70, spectralClass: 'B2', name: 'Lesath', catalogId: 'υ Sco', constellation: 'Scorpius', rightAscension: 17.51, declination: -37.30 },
      { x: 0, y: 0, magnitude: 3.21, spectralClass: 'F3', name: 'Fang', catalogId: 'π Sco', constellation: 'Scorpius', rightAscension: 15.98, declination: -26.11 }
    ],
    lines: [[6,2], [2,1], [1,0], [0,3], [3,4], [4,5]]
  },
  cassiopeia: {
    name: 'Cassiopeia',
    abbreviation: 'Cas',
    mythology: 'The Queen',
    season: 'Autumn',
    stars: [
      { x: 0, y: 0, magnitude: 2.24, spectralClass: 'K0', name: 'Schedar', catalogId: 'α Cas', constellation: 'Cassiopeia', rightAscension: 0.67, declination: 56.54 },
      { x: 0, y: 0, magnitude: 2.28, spectralClass: 'F2', name: 'Caph', catalogId: 'β Cas', constellation: 'Cassiopeia', rightAscension: 0.15, declination: 59.15 },
      { x: 0, y: 0, magnitude: 2.47, spectralClass: 'B0', name: 'Navi', catalogId: 'γ Cas', constellation: 'Cassiopeia', rightAscension: 0.95, declination: 60.72 },
      { x: 0, y: 0, magnitude: 2.68, spectralClass: 'A5', name: 'Ruchbah', catalogId: 'δ Cas', constellation: 'Cassiopeia', rightAscension: 1.43, declination: 60.24 },
      { x: 0, y: 0, magnitude: 3.35, spectralClass: 'B3', name: 'Segin', catalogId: 'ε Cas', constellation: 'Cassiopeia', rightAscension: 1.91, declination: 63.67 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4]]
  },
  cygnus: {
    name: 'Cygnus',
    abbreviation: 'Cyg',
    mythology: 'The Swan',
    season: 'Summer',
    stars: [
      { x: 0, y: 0, magnitude: 1.25, spectralClass: 'A2', name: 'Deneb', catalogId: 'α Cyg', constellation: 'Cygnus', rightAscension: 20.69, declination: 45.28 },
      { x: 0, y: 0, magnitude: 3.05, spectralClass: 'K3', name: 'Albireo', catalogId: 'β Cyg', constellation: 'Cygnus', rightAscension: 19.51, declination: 27.96 },
      { x: 0, y: 0, magnitude: 2.23, spectralClass: 'F8', name: 'Sadr', catalogId: 'γ Cyg', constellation: 'Cygnus', rightAscension: 20.37, declination: 40.26 },
      { x: 0, y: 0, magnitude: 2.86, spectralClass: 'A0', name: 'Gienah', catalogId: 'ε Cyg', constellation: 'Cygnus', rightAscension: 20.77, declination: 33.97 },
      { x: 0, y: 0, magnitude: 2.49, spectralClass: 'B9', name: 'Delta Cygni', catalogId: 'δ Cyg', constellation: 'Cygnus', rightAscension: 19.75, declination: 45.13 }
    ],
    lines: [[4,2], [2,0], [2,3], [2,1]]
  },
  lyra: {
    name: 'Lyra',
    abbreviation: 'Lyr',
    mythology: 'The Lyre',
    season: 'Summer',
    stars: [
      { x: 0, y: 0, magnitude: 0.03, spectralClass: 'A0', name: 'Vega', catalogId: 'α Lyr', constellation: 'Lyra', rightAscension: 18.62, declination: 38.78 },
      { x: 0, y: 0, magnitude: 3.52, spectralClass: 'M4', name: 'Sulafat', catalogId: 'γ Lyr', constellation: 'Lyra', rightAscension: 18.98, declination: 32.69 },
      { x: 0, y: 0, magnitude: 4.30, spectralClass: 'B7', name: 'Sheliak', catalogId: 'β Lyr', constellation: 'Lyra', rightAscension: 18.83, declination: 33.36 },
      { x: 0, y: 0, magnitude: 4.94, spectralClass: 'A8', name: 'Delta1 Lyrae', catalogId: 'δ¹ Lyr', constellation: 'Lyra', rightAscension: 18.88, declination: 36.90 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,0]]
  }
};

// Enhanced Astronomical Constellation Background
const ConstellationBackground: React.FC<{ theme: ColorTheme }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    brightness: number;
    twinkleSpeed: number;
    spectralClass: string;
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
  const nebulaeRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    opacity: number;
    color: string;
  }>>([]);

  // Convert celestial coordinates to screen coordinates
  const celestialToScreen = (ra: number, dec: number, width: number, height: number) => {
    // Simple projection - in a real planetarium app, you'd use proper astronomical projections
    const x = (ra / 24) * width;
    const y = height - ((dec + 90) / 180) * height;
    return { x, y };
  };

  // Get star color based on spectral class
  const getStarColor = (spectralClass: string) => {
    switch (spectralClass.charAt(0)) {
      case 'O': return '#9bb0ff'; // Blue
      case 'B': return '#aabfff'; // Blue-white
      case 'A': return '#cad7ff'; // White
      case 'F': return '#f8f7ff'; // Yellow-white
      case 'G': return '#fff4ea'; // Yellow (like our Sun)
      case 'K': return '#ffd2a1'; // Orange
      case 'M': return '#ffad51'; // Red
      default: return '#ffffff';
    }
  };

  // Calculate star size based on magnitude (brighter = larger)
  const getMagnitudeSize = (magnitude: number) => {
    // Magnitude scale is inverted (lower = brighter)
    // Typical range: -1.5 (brightest) to 6.5 (faintest visible)
    const normalizedMag = Math.max(0, Math.min(8, magnitude + 1.5));
    return Math.max(0.5, 4 - (normalizedMag * 0.4));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recalculate star positions based on astronomical coordinates
      const projectedStars: typeof starsRef.current = [];
      
      Object.values(STAR_CATALOG).forEach((constellation: ConstellationData) => {
        constellation.stars.forEach((star: RealStar) => {
          const screenPos = celestialToScreen(star.rightAscension, star.declination, canvas.width, canvas.height);
          projectedStars.push({
            x: screenPos.x,
            y: screenPos.y,
            size: getMagnitudeSize(star.magnitude),
            brightness: Math.max(0.1, 1 - (star.magnitude / 6)), // Convert magnitude to brightness
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            spectralClass: star.spectralClass
          });
        });
      });
      
      starsRef.current = projectedStars;
      
      // Add some background field stars
      for (let i = 0; i < 300; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          brightness: Math.random() * 0.3 + 0.1,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          spectralClass: ['A', 'F', 'G', 'K', 'M'][Math.floor(Math.random() * 5)]
        });
      }
      
      // Initialize nebulae
      nebulaeRef.current = [
        { x: canvas.width * 0.3, y: canvas.height * 0.2, radius: 80, opacity: 0.1, color: '#ff6b6b' },
        { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: 60, opacity: 0.08, color: '#4ecdc4' },
        { x: canvas.width * 0.1, y: canvas.height * 0.8, radius: 100, opacity: 0.06, color: '#ffe66d' }
      ];
    };
    
    resizeCanvas();

    // Initialize shooting stars
    const createShootingStar = () => ({
      x: Math.random() * canvas.width,
      y: -50,
      vx: -2 - Math.random() * 3,
      vy: 3 + Math.random() * 4,
      length: 60 + Math.random() * 80,
      opacity: 0.8 + Math.random() * 0.2,
      active: true
    });

    const animate = () => {
      // Deep space background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.5, '#050505');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae
      nebulaeRef.current.forEach((nebula) => {
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        nebulaGradient.addColorStop(0, nebula.color + Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0'));
        nebulaGradient.addColorStop(0.5, nebula.color + '08');
        nebulaGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = nebulaGradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw constellation lines
      Object.values(STAR_CATALOG).forEach((constellation: ConstellationData) => {
        ctx.strokeStyle = theme.glow + '25';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 4]);
        
        constellation.lines.forEach((line: number[]) => {
          const [startIdx, endIdx] = line;
          if (startIdx < constellation.stars.length && endIdx < constellation.stars.length) {
            const startStar = constellation.stars[startIdx];
            const endStar = constellation.stars[endIdx];
            const startPos = celestialToScreen(startStar.rightAscension, startStar.declination, canvas.width, canvas.height);
            const endPos = celestialToScreen(endStar.rightAscension, endStar.declination, canvas.width, canvas.height);
            
            ctx.beginPath();
            ctx.moveTo(startPos.x, startPos.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();
          }
        });
        
        ctx.setLineDash([]);
      });

      // Draw stars with proper astronomical rendering
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(frameRef.current * star.twinkleSpeed) * 0.3 + 0.7;
        const starColor = getStarColor(star.spectralClass);
        const finalBrightness = star.brightness * twinkle;

        // Star diffraction spikes for brighter stars
        if (star.size > 2) {
          ctx.strokeStyle = starColor + Math.floor(finalBrightness * 100).toString(16).padStart(2, '0');
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 3, star.y);
          ctx.lineTo(star.x + star.size * 3, star.y);
          ctx.moveTo(star.x, star.y - star.size * 3);
          ctx.lineTo(star.x, star.y + star.size * 3);
          ctx.stroke();
        }

        // Star glow
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 6
        );
        glowGradient.addColorStop(0, starColor + Math.floor(finalBrightness * 180).toString(16).padStart(2, '0'));
        glowGradient.addColorStop(0.3, starColor + Math.floor(finalBrightness * 60).toString(16).padStart(2, '0'));
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = starColor + Math.floor(Math.min(255, finalBrightness * 255)).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw constellation names
      Object.values(STAR_CATALOG).forEach((constellation: ConstellationData) => {
        if (constellation.stars.length > 0) {
          // Find constellation center
          let centerX = 0, centerY = 0;
          constellation.stars.forEach((star: RealStar) => {
            const pos = celestialToScreen(star.rightAscension, star.declination, canvas.width, canvas.height);
            centerX += pos.x;
            centerY += pos.y;
          });
          centerX /= constellation.stars.length;
          centerY /= constellation.stars.length;

          // Draw constellation name
          ctx.fillStyle = theme.text + '40';
          ctx.font = '12px "Courier New", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(constellation.name, centerX, centerY - 20);
          
          // Draw mythology subtitle
          if (constellation.mythology) {
            ctx.font = '10px "Courier New", monospace';
            ctx.fillStyle = theme.textSecondary + '30';
            ctx.fillText(`"${constellation.mythology}"`, centerX, centerY - 5);
          }
        }
      });

      // Add shooting stars occasionally
      if (Math.random() < 0.008 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push(createShootingStar());
      }

      // Draw and update shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        if (!star.active) return false;

        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.vx * star.length, star.y - star.vy * star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.3, `rgba(173, 216, 230, ${star.opacity * 0.6})`);
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
        star.opacity *= 0.985;

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
      style={{ opacity: 0.85 }}
    />
  );
};

// Deep Space Phenomena (planets, satellites, etc.)
const DeepSpaceElements: React.FC<{ theme: ColorTheme }> = ({ theme }) => {
  const phenomena = [
    { symbol: '♃', name: 'Jupiter', color: '#D2691E', period: 45 },
    { symbol: '♂', name: 'Mars', color: '#CD5C5C', period: 35 },
    { symbol: '♀', name: 'Venus', color: '#FFC649', period: 25 },
    { symbol: '☿', name: 'Mercury', color: '#C0C0C0', period: 15 },
    { symbol: '♄', name: 'Saturn', color: '#FAD5A5', period: 55 },
    { symbol: '⛢', name: 'Uranus', color: '#4FD0E7', period: 85 },
    { symbol: '♆', name: 'Neptune', color: '#4169E1', period: 75 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {phenomena.map((planet, i) => (
        <div
          key={i}
          className="absolute text-lg opacity-30 font-bold"
          style={{
            color: planet.color,
            left: `${5 + (i % 7) * 13}%`,
            animation: `deepSpaceOrbit ${planet.period}s linear infinite`,
            animationDelay: `${i * 3}s`,
            textShadow: `0 0 10px ${planet.color}60`
          }}
          title={planet.name}
        >
          {planet.symbol}
        </div>
      ))}
      
      <style>{`
        @keyframes deepSpaceOrbit {
          from {
            transform: translateY(100vh) rotate(0deg);
          }
          to {
            transform: translateY(-50px) rotate(360deg);
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
      <DeepSpaceElements theme={theme} />
      
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

        {/* Market Intelligence Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            className="p-6 rounded border-2 relative"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInLeft 1s ease-out 1s both'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6" style={{color: theme.glow}} />
              <h3 className="text-xl font-bold" style={{color: theme.text}}>
                MARKET INTELLIGENCE
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: theme.card}}>
                <span className="text-sm" style={{color: theme.textSecondary}}>S&P 500 Sentiment</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{color: '#10B981'}} />
                  <span className="font-bold" style={{color: '#10B981'}}>BULLISH</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: theme.card}}>
                <span className="text-sm" style={{color: theme.textSecondary}}>Crypto Fear Index</span>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" style={{color: '#EF4444'}} />
                  <span className="font-bold" style={{color: '#EF4444'}}>FEAR</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: theme.card}}>
                <span className="text-sm" style={{color: theme.textSecondary}}>VIX Index</span>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" style={{color: '#F59E0B'}} />
                  <span className="font-bold" style={{color: '#F59E0B'}}>ELEVATED</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="p-6 rounded border-2 relative"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInRight 1s ease-out 1.2s both'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6" style={{color: theme.glow}} />
              <h3 className="text-xl font-bold" style={{color: theme.text}}>
                COSMIC ALIGNMENT
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: theme.card}}>
                <span className="text-sm" style={{color: theme.textSecondary}}>Mercury Transit</span>
                <span className="font-bold" style={{color: theme.glow}}>FAVORABLE</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: theme.card}}>
                <span className="text-sm" style={{color: theme.textSecondary}}>Mars Influence</span>
                <span className="font-bold" style={{color: '#EF4444'}}>AGGRESSIVE</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded" style={{backgroundColor: theme.card}}>
                <span className="text-sm" style={{color: theme.textSecondary}}>Jupiter Blessing</span>
                <span className="font-bold" style={{color: '#10B981'}}>EXPANSION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Community & Resources Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="p-6 rounded border-2 text-center transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInUp 1s ease-out 1.4s both'
            }}
          >
            <Users className="w-8 h-8 mx-auto mb-4" style={{color: theme.glow}} />
            <h4 className="text-lg font-bold mb-2" style={{color: theme.text}}>
              TRADING CIRCLE
            </h4>
            <p className="text-sm mb-4" style={{color: theme.textSecondary}}>
              Join our mystical trading community for exclusive insights and cosmic market wisdom.
            </p>
            <button 
              className="px-4 py-2 rounded border font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.accent,
                color: theme.text
              }}
            >
              JOIN CIRCLE
            </button>
          </div>

          <div 
            className="p-6 rounded border-2 text-center transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInUp 1s ease-out 1.6s both'
            }}
          >
            <Globe className="w-8 h-8 mx-auto mb-4" style={{color: theme.glow}} />
            <h4 className="text-lg font-bold mb-2" style={{color: theme.text}}>
              GLOBAL ORACLE
            </h4>
            <p className="text-sm mb-4" style={{color: theme.textSecondary}}>
              Access real-time market oracles and cosmic economic indicators from around the world.
            </p>
            <button 
              className="px-4 py-2 rounded border font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.accent,
                color: theme.text
              }}
            >
              EXPLORE
            </button>
          </div>

          <div 
            className="p-6 rounded border-2 text-center transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: 'slideInUp 1s ease-out 1.8s both'
            }}
          >
            <Star className="w-8 h-8 mx-auto mb-4" style={{color: theme.glow}} />
            <h4 className="text-lg font-bold mb-2" style={{color: theme.text}}>
              PREMIUM DIVINATION
            </h4>
            <p className="text-sm mb-4" style={{color: theme.textSecondary}}>
              Unlock advanced tarot algorithms and personalized cosmic trading strategies.
            </p>
            <button 
              className="px-4 py-2 rounded border font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.accent,
                color: theme.text
              }}
            >
              UPGRADE
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t" style={{borderColor: theme.border}}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4 text-lg" style={{color: theme.text}}>
                TAROT TRADER
              </h5>
              <p className="text-sm leading-relaxed" style={{color: theme.textSecondary}}>
                Harnessing the ancient wisdom of tarot with modern market intelligence to guide your trading journey through the cosmic markets.
              </p>
            </div>
            
            <div>
              <h6 className="font-bold mb-3" style={{color: theme.text}}>TRADING</h6>
              <ul className="space-y-2 text-sm" style={{color: theme.textSecondary}}>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Stock Markets</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Cryptocurrency</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Forex</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Commodities</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-bold mb-3" style={{color: theme.text}}>MYSTICAL</h6>
              <ul className="space-y-2 text-sm" style={{color: theme.textSecondary}}>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Tarot Readings</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Astrological Charts</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Cosmic Calendars</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Sacred Geometry</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-bold mb-3" style={{color: theme.text}}>COMMUNITY</h6>
              <ul className="space-y-2 text-sm" style={{color: theme.textSecondary}}>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Discord Server</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Trading Blog</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Market Analysis</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t" style={{borderColor: theme.border}}>
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <span className="text-sm" style={{color: theme.textSecondary}}>
                © 2024 Tarot Trader. All cosmic rights reserved.
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" style={{color: theme.glow}} />
                <span className="text-xs" style={{color: theme.textSecondary}}>
                  Lunar Phase: Waning Crescent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" style={{color: '#F59E0B'}} />
                <span className="text-xs" style={{color: theme.textSecondary}}>
                  Solar Activity: Moderate
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TarotTraderApp;