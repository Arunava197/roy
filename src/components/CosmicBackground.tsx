import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let scrollY = 0;
    let prevScrollY = 0;

    let stars: any[] = [];
    let shootingStars: any[] = [];

    // Supernova event state
    let eventState = 0; // 0=normal, 1=gather, 2=explode
    let eventTime = 0;
    let eventX = 0;
    let eventY = 0;
    let flashOpacity = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      if (stars.length === 0) initStars();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const initStars = () => {
      stars = [];
      // Adjust density based on screen size
      const numStars = Math.floor((width * height) / 1500);
      for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
      }
    };

    const createStar = (x?: number, y?: number) => {
      return {
        x: x !== undefined ? x : Math.random() * width,
        y: y !== undefined ? y : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        flicker: Math.random() * 0.02 + 0.005,
        // Base color mixed based on theme
        color: Math.random() > 0.7 ? 'cyan' : (theme === 'dark' ? 'white' : 'blue'),
        trail: [] // We can add trails if needed later
      };
    };

    const spawnShootingStar = () => {
      const startX = Math.random() * width;
      const startY = -50;
      // Angle diagonally down-right or down-left
      const angle = (Math.random() > 0.5 ? 1 : 3) * Math.PI / 4 + (Math.random() * 0.5 - 0.25);
      const speed = Math.random() * 15 + 15;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 100 + 50,
        opacity: 1,
      });
    };

    // Initialize timers
    let nextShootingStar = performance.now() + Math.random() * 5000 + 2000;
    // Supernova happens every 15-30 seconds
    let nextEventTime = performance.now() + Math.random() * 15000 + 15000; 

    const draw = (time: number) => {
      const isDark = theme === 'dark';
      
      const scrollDelta = scrollY - prevScrollY;
      prevScrollY = scrollY;

      // Event Triggers
      if (time > nextShootingStar) {
        spawnShootingStar();
        nextShootingStar = time + Math.random() * 8000 + 4000; // Next in 4-12s
      }

      if (eventState === 0 && time > nextEventTime) {
        eventState = 1; // Start gathering
        eventTime = time;
        // Pick a random focal point for the black hole
        eventX = Math.random() * (width * 0.6) + (width * 0.2);
        eventY = Math.random() * (height * 0.6) + (height * 0.2);
      }

      const timeInEvent = time - eventTime;
      const GATHER_DUR = 12000; // 12 seconds of gathering/swirling galaxy emergence
      const EXPLODE_DUR = 2000; // 2 seconds of blast

      if (eventState === 1 && timeInEvent > GATHER_DUR) {
        eventState = 2; // EXPLODE
        eventTime = time;
        flashOpacity = 1;
        
        // Push all stars violently outward
        stars.forEach(s => {
          const dx = s.x - eventX;
          const dy = s.y - eventY;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const force = (Math.random() * 4000 + 2000) / (dist * 0.5); 
          s.vx = (dx / dist) * force;
          s.vy = (dy / dist) * force;
        });
      } else if (eventState === 2 && timeInEvent > EXPLODE_DUR) {
        eventState = 0; // Return to normal
        nextEventTime = time + Math.random() * 20000 + 15000; // Next supernova in 15-35s
      }

      // 1. Draw Background
      ctx.fillStyle = isDark ? '#02040a' : '#f1f5f9';
      ctx.fillRect(0, 0, width, height);

      // Draw Constellations
      const drawConstellation = (
         centerX: number, centerY: number, 
         scale: number, 
         points: {x: number, y: number}[], 
         connections: number[][],
         glowSpeed: number,
         specialStars?: {index: number, size: number, color?: string}[]
      ) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        
        const glowPhase = (Math.sin(time * glowSpeed) + 1) * 0.5;
        const lineAlpha = (isDark ? 0.15 : 0.2) + glowPhase * 0.1;
        
        ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${lineAlpha})` : `rgba(15, 23, 42, ${lineAlpha})`;
        ctx.lineWidth = 1;
        
        connections.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        });

        points.forEach((p, i) => {
          const starAlpha = 0.5 + Math.random() * 0.3; // Flicker
          ctx.beginPath();
          let radius = 1.5;
          ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${starAlpha})` : `rgba(15, 23, 42, ${starAlpha})`;
          
          if (specialStars) {
             const special = specialStars.find(s => s.index === i);
             if (special) {
                radius = special.size;
                if (special.color) {
                   ctx.fillStyle = special.color.replace('ALPHA', starAlpha.toString());
                }
             }
          }
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.restore();
      };

      const drawOrion = () => {
        const orionCenterX = width * 0.75; 
        const orionCenterY = (height * 0.25) - scrollY * 0.2; // Parallax
        const orionScale = Math.max(0.4, Math.min(width, height) / 800);
        
        const orionPoints = [
          { x: -40, y: -80 }, // Betelgeuse
          { x: 40, y: -60 },  // Bellatrix
          { x: -15, y: -10 }, // Mintaka
          { x: 0, y: 0 },     // Alnilam
          { x: 15, y: 10 },   // Alnitak
          { x: 50, y: 90 },   // Rigel
          { x: -30, y: 100 }, // Saiph
        ];

        const connections = [
          [0, 1], [0, 2], [1, 4], 
          [2, 3], [3, 4],         
          [2, 6], [4, 5],         
        ];

        drawConstellation(orionCenterX, orionCenterY, orionScale, orionPoints, connections, 0.001, [
           { index: 0, size: 2.5, color: 'rgba(252, 165, 165, ALPHA)' }, // Betelgeuse red hint
           { index: 5, size: 2.5, color: 'rgba(186, 230, 253, ALPHA)' }  // Rigel blue hint
        ]);
        
        // Orion Nebula (small smudge below belt)
        ctx.save();
        ctx.translate(orionCenterX, orionCenterY);
        ctx.scale(orionScale, orionScale);
        ctx.beginPath();
        ctx.arc(0, 30, 15, 0, Math.PI * 2);
        const nebGrad = ctx.createRadialGradient(0, 30, 0, 0, 30, 15);
        nebGrad.addColorStop(0, isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(219, 39, 119, 0.1)'); // Pinkish
        nebGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nebGrad;
        ctx.fill();
        ctx.restore();
      };
      
      const drawUrsaMajor = () => {
        const centerX = width * 0.25; 
        const centerY = (height * 0.15) - scrollY * 0.15; // Parallax
        const scale = Math.max(0.35, Math.min(width, height) / 1000);
        
        const points = [
          { x: -90, y: -20 }, // Alkaid
          { x: -50, y: -10 }, // Mizar
          { x: -20, y: 0 },   // Alioth
          { x: 10, y: 10 },   // Megrez
          { x: -5, y: 40 },   // Phecda
          { x: 35, y: 55 },   // Merak
          { x: 50, y: 15 },   // Dubhe
        ];

        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]
        ];

        drawConstellation(centerX, centerY, scale, points, connections, 0.0012, [
           { index: 1, size: 1.2 }, // Mizar smaller
           { index: 6, size: 2.2 }  // Dubhe slightly larger
        ]);
      }

      const drawCassiopeia = () => {
        const centerX = width * 0.2; 
        const centerY = (height * 0.8) - scrollY * 0.25; // Parallax
        const scale = Math.max(0.4, Math.min(width, height) / 900);
        
        const points = [
          { x: -50, y: -20 }, // Epsilon
          { x: -15, y: 25 },  // Delta
          { x: 5, y: -10 },   // Gamma
          { x: 35, y: 30 },   // Alpha
          { x: 55, y: -15 },  // Beta
        ];

        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4]
        ];

        drawConstellation(centerX, centerY, scale, points, connections, 0.0008, [
           { index: 3, size: 2.2 } // Alpha Cassiopeiae
        ]);
      }

      // Draw Constellations independent of event normally, but maybe fade out during explosion
      if (eventState !== 2) {
        drawOrion();
        drawUrsaMajor();
        drawCassiopeia();
      }

      // 2. Draw Black Hole / Gathering Effect
      if (eventState === 1) {
        const progress = timeInEvent / GATHER_DUR;
        // Event horizon grows
        const ehRadius = Math.max(1, progress * 45); 

        // Draw Subdued Galaxy Dust Plate
        const galaxyAlpha = Math.sin(progress * Math.PI); // Fades in and out softly over 12s
        if (galaxyAlpha > 0) {
           const galRadius = Math.max(width, height) * 1.5;
           const galGradient = ctx.createRadialGradient(eventX, eventY, ehRadius, eventX, eventY, galRadius);
           galGradient.addColorStop(0, isDark ? `rgba(14, 165, 233, ${galaxyAlpha * 0.3})` : `rgba(3, 105, 161, ${galaxyAlpha * 0.2})`);
           galGradient.addColorStop(0.5, isDark ? `rgba(239, 68, 68, ${galaxyAlpha * 0.1})` : `rgba(220, 38, 38, ${galaxyAlpha * 0.05})`);
           galGradient.addColorStop(1, 'transparent');
           
           ctx.save();
           ctx.translate(eventX, eventY);
           ctx.rotate(time * 0.0002); // Slow global rotation
           ctx.scale(1, 0.6); // Flatten to create a disc
           
           ctx.fillStyle = galGradient;
           ctx.fillRect(-galRadius, -galRadius, galRadius * 2, galRadius * 2);
           ctx.restore();
        }
        
        // Swirl physics to form emerging galaxy shape
        stars.forEach(s => {
          const dx = eventX - s.x;
          const dy = eventY - s.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist > ehRadius) {
            // Gravitational pull
            const pull = (progress * 80) / Math.max(dist, 10);
            const angle = Math.atan2(dy, dx);
            
            // Tangential velocity for swirling - increases as they get closer / time passes
            const swirlForce = progress * 25 + (300 / Math.max(dist, 10));
            
            const targetVx = Math.cos(angle) * pull + Math.cos(angle + Math.PI/2) * swirlForce;
            const targetVy = Math.sin(angle) * pull + Math.sin(angle + Math.PI/2) * swirlForce;

            // Ease into the target velocity smoothly
            s.vx += (targetVx - s.vx) * 0.04;
            s.vy += (targetVy - s.vy) * 0.04;
          }

          // If consumed by black hole, respawn at edges to keep the feed going
          if (dist < ehRadius + 5) {
            const spawnAngle = Math.random() * Math.PI * 2;
            const spawnDist = Math.max(width, height) * 0.7;
            s.x = eventX + Math.cos(spawnAngle) * spawnDist;
            s.y = eventY + Math.sin(spawnAngle) * spawnDist;
            s.vx = 0;
            s.vy = 0;
          }
        });

        // Draw Event Horizon
        ctx.beginPath();
        ctx.arc(eventX, eventY, ehRadius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#000000' : '#0f172a';
        ctx.fill();

        // Glowing photon ring
        ctx.beginPath();
        ctx.arc(eventX, eventY, ehRadius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? `rgba(14, 165, 233, ${progress})` : `rgba(3, 105, 161, ${progress})`;
        ctx.lineWidth = 2 + progress * 4;
        ctx.shadowColor = isDark ? '#0ea5e9' : '#0284c7';
        ctx.shadowBlur = 30 * progress;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. Draw Stars
      stars.forEach(s => {
        // Normal state physics (drift + parallax)
        if (eventState === 0) {
          s.y -= scrollDelta * (s.size * 0.25); // Parallax effect
          
          // Gradually slow down stars after explosion to normal drift
          const randomDriftX = (Math.random() - 0.5) * 0.5;
          const randomDriftY = (Math.random() - 0.5) * 0.5;
          s.vx += (randomDriftX - s.vx) * 0.02;
          s.vy += (randomDriftY - s.vy) * 0.02;
        }

        s.x += s.vx;
        s.y += s.vy;

        // Screen wrapping (only when not strictly swirling or exploding heavily)
        if (eventState !== 2) {
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height + 50; 
          if (s.y > height + 50) s.y = 0;
        }

        // Twinkling effect
        s.opacity += s.flicker;
        if (s.opacity > 1 || s.opacity < 0.2) {
          s.flicker = -s.flicker;
        }

        const speedSq = s.vx*s.vx + s.vy*s.vy;
        
        // Draw star
        ctx.beginPath();
        if (speedSq > 15) {
          // Draw as a streak if moving very fast (during supernova)
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
          ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${s.opacity})` : `rgba(15, 23, 42, ${s.opacity})`;
          if (s.color === 'cyan') ctx.strokeStyle = isDark ? `rgba(34, 211, 238, ${s.opacity})` : `rgba(2, 132, 199, ${s.opacity})`;
          ctx.lineWidth = s.size;
          ctx.stroke();
        } else {
          // Normal circle star
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          let fillColor = 'rgba(255,255,255,';
          if (!isDark) fillColor = 'rgba(15,23,42,';
          if (s.color === 'cyan') fillColor = isDark ? 'rgba(34, 211, 238,' : 'rgba(2, 132, 199,';
          else if (s.color === 'blue') fillColor = isDark ? 'rgba(96, 165, 250,' : 'rgba(37, 99, 235,';
          
          ctx.fillStyle = fillColor + String(s.opacity) + ')';
          ctx.fill();
        }
      });

      // 4. Draw Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.opacity -= 0.02; // Fade out

        if (ss.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 2, ss.y - ss.vy * 2);
        gradient.addColorStop(0, isDark ? `rgba(255, 255, 255, ${ss.opacity})` : `rgba(15, 23, 42, ${ss.opacity})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 5. Draw Supernova Flash
      if (flashOpacity > 0) {
        ctx.fillStyle = isDark ? `rgba(253, 224, 71, ${flashOpacity})` : `rgba(250, 204, 21, ${flashOpacity * 0.5})`; // Sun colored
        ctx.fillRect(0, 0, width, height);
        // Quick flash decay
        flashOpacity -= 0.04;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const wrapperClass = theme === 'dark' ? 'bg-[#02040a]' : 'bg-[#f1f5f9]';

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-700 ${wrapperClass}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
