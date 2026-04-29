import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from "framer-motion";

// ─── EMBEDDED ASSETS ─────────────────────────────────────────────────────────
import { VIDEO_SRC, IMG } from './assets';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SKILLS_LIST = [
  { name:"HTML & CSS",     type:"Language"   },
  { name:"JavaScript",     type:"Language"   },
  { name:"C++",            type:"Language"   },
  { name:"React.js",       type:"Frontend"   },
  { name:"Three.js",       type:"Frontend"   },
  { name:"Tailwind CSS",   type:"Frontend"   },
  { name:"Node.js",        type:"Backend"    },
  { name:"Express",        type:"Backend"    },
  { name:"Socket.io",      type:"Backend"    },
  { name:"WhatsApp Bots",  type:"Speciality" },
  { name:"Graphics/Design",type:"Speciality" },
  { name:"Git & GitHub",   type:"Tools"      },
];

const INITIAL_PROJECTS = [
  {
    id:"01", title:"VORTE PRO", category:"Platform", year:"2025",
    desc:"Multi-session WhatsApp bot platform. Two-server architecture — pairing frontend + feature-rich bot backend. Commands, AI, games, group tools.",
    stack:["Node.js","Socket.io","React","Vite","Express"],
    live:"https://vorte-pro-pairing.onrender.com",
    github:"https://github.com/abudharyally48-cloud",
    headerImg:"coding_keyboard",
  },
  {
    id:"02", title:"Login UI System", category:"UI / Auth", year:"2025",
    desc:"Cinematic authentication UI with glassmorphism card, animated background, and smooth user flow. Built mobile-first.",
    stack:["HTML","CSS","JavaScript"],
    live:"#", github:"https://github.com/abudharyally48-cloud",
    headerImg:"login_ui",
  },
  {
    id:"03", title:"UI Component Library", category:"Design System", year:"2025",
    desc:"Custom component library — buttons, inputs, cards, interactive elements built from scratch with a consistent dark design language.",
    stack:["CSS","JavaScript","Tailwind CSS"],
    live:"#", github:"https://github.com/abudharyally48-cloud",
    headerImg:"buttons",
  },
  {
    id:"04", title:"Web Layout System", category:"Frontend / UX", year:"2024",
    desc:"Wireframe-to-code workflow: structured web layouts designed with precision, responsive grids, and clean user flows from concept to browser.",
    stack:["HTML","CSS","JavaScript"],
    live:"#", github:"https://github.com/abudharyally48-cloud",
    headerImg:"wireframe",
  },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  arrowUpRight: ({s=16})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  ),
  github: ({s=16})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  mail: ({s=16})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  whatsapp: ({s=16})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  plus: ({s=16})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  x: ({s=16})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  check: ({s=14})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  expand: ({s=14})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  ),
  menu: ({s=20})=>(
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
};

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const mouse   = useRef({ x:-200, y:-200 });
  const ringPos = useRef({ x:-200, y:-200 });
  const raf = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dot.current) dot.current.style.transform = `translate(${e.clientX-3}px,${e.clientY-3}px)`;
    };
    const loop = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.current.x-22}px,${ringPos.current.y-22}px)`;
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive:true });
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot}  style={{ position:"fixed",top:0,left:0,width:6,height:6,borderRadius:"50%",background:"#fff",pointerEvents:"none",zIndex:9999,mixBlendMode:"difference",willChange:"transform" }}/>
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:44,height:44,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.32)",pointerEvents:"none",zIndex:9998,willChange:"transform" }}/>
    </>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMobileOpen(false); };
  const links = [
    { label:"Work",    id:"work"    },
    { label:"About",   id:"about"   },
    { label:"Skills",  id:"skills"  },
    { label:"Contact", id:"contact" },
  ];

  const NAV_BG = scrolled ? "rgba(6,6,6,0.94)" : "transparent";
  const NAV_BD = scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent";

  return (
    <>
      <motion.header
        initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, delay:0.3 }}
        style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,
          padding:"18px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",
          background:NAV_BG, borderBottom:NAV_BD,
          backdropFilter:scrolled?"blur(16px)":"none",
          transition:"background 0.5s,border-color 0.5s,backdrop-filter 0.5s" }}>

        <span style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:15,color:"#fff",letterSpacing:"0.05em",cursor:"none" }}
          onClick={() => go("hero")}>
          SAID<span style={{ color:"rgba(255,255,255,0.25)" }}>.</span>
        </span>

        {/* Desktop nav */}
        <nav style={{ display:"flex",gap:28,alignItems:"center" }} className="desk-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)}
              style={{ fontFamily:"Inter,sans-serif",fontSize:12,color:"rgba(255,255,255,0.38)",background:"none",border:"none",cursor:"none",transition:"color 0.2s",letterSpacing:"0.04em",padding:0 }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.38)"}>
              {l.label}
            </button>
          ))}
        </nav>

        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <a href="mailto:azzahsaid532@gmail.com"
            style={{ padding:"8px 18px",border:"1px solid rgba(255,255,255,0.18)",borderRadius:100,fontFamily:"Syne,sans-serif",fontWeight:600,fontSize:11,color:"#fff",textDecoration:"none",letterSpacing:"0.07em",transition:"all 0.25s",cursor:"none" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.4)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; }}>
            Hire Me
          </a>
          <button onClick={() => setMobileOpen(o=>!o)} className="mob-btn"
            style={{ background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4,display:"none" }}>
            {mobileOpen ? <Ico.x s={20}/> : <Ico.menu s={20}/>}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-16 }}
            style={{ position:"fixed",top:58,left:0,right:0,zIndex:99,background:"rgba(6,6,6,0.97)",backdropFilter:"blur(20px)",
              padding:"20px 28px 28px",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            {links.map(l => (
              <button key={l.id} onClick={()=>go(l.id)}
                style={{ display:"block",width:"100%",textAlign:"left",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:20,color:"rgba(255,255,255,0.65)",
                  background:"none",border:"none",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",cursor:"pointer" }}>
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO (VIDEO BG) ──────────────────────────────────────────────────────────
function Hero() {
  const container = useRef(null);
  const videoRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target:container, offset:["start start","end start"] });

  // Parallax: content drifts up as user scrolls
  const yContent  = useTransform(scrollYProgress, [0,1], [0, 130]);
  const fadeOut   = useTransform(scrollYProgress, [0,0.55], [1, 0]);
  // Overlay darkens as user scrolls — video fades behind content
  const overlayOp = useTransform(scrollYProgress, [0, 0.75], [0.52, 0.95]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, 4, { duration:2.4, delay:1.3, ease:"easeOut", onUpdate:(v)=>setCount(Math.round(v)) });
    return () => ctrl.stop();
  }, []);

  return (
    <section ref={container} id="hero"
      style={{ minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",position:"relative",overflow:"hidden" }}>

      {/* ── VIDEO BACKGROUND ── */}
      <video ref={videoRef} src={VIDEO_SRC}
        autoPlay loop muted playsInline
        style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center" }}/>

      {/* Cinematic overlay — darkens on scroll */}
      <motion.div style={{ position:"absolute",inset:0, opacity:overlayOp,
        background:"linear-gradient(160deg,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.55) 60%,rgba(0,0,0,0.3) 100%)" }}/>

      {/* Bottom fade — blends into page */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"45%",
        background:"linear-gradient(to bottom,transparent,#060606)",pointerEvents:"none" }}/>

      {/* Top fade */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:200,
        background:"linear-gradient(to bottom,rgba(0,0,0,0.65),transparent)",pointerEvents:"none" }}/>

      {/* Subtle film-grain scanlines */}
      <div style={{ position:"absolute",inset:0,pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)",
        opacity:0.6 }}/>

      {/* ── CONTENT ── */}
      <motion.div style={{ y:yContent, opacity:fadeOut, position:"relative",zIndex:10,padding:"0 36px 60px" }}>

        {/* Top rule */}
        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ duration:1.4, delay:0.05, ease:[0.16,1,0.3,1] }}
          style={{ height:1,background:"rgba(255,255,255,0.1)",marginBottom:18,transformOrigin:"left" }}/>

        {/* Meta row */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.65 }}
          style={{ display:"flex",justifyContent:"space-between",marginBottom:26,flexWrap:"wrap",gap:8 }}>
          <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.32)",letterSpacing:"0.16em",textTransform:"uppercase" }}>
            Full-Stack Developer · Tanzania · Age 17
          </span>
          <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.22)",letterSpacing:"0.12em",textTransform:"uppercase" }}>
            Open to Work · 2026
          </span>
        </motion.div>

        {/* Name — split reveal */}
        <div style={{ overflow:"hidden",marginBottom:-4 }}>
          <motion.div initial={{ y:"108%" }} animate={{ y:"0%" }}
            transition={{ duration:1.05, delay:0.45, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:"Syne,sans-serif",fontWeight:800,
              fontSize:"clamp(60px,11vw,170px)",lineHeight:0.88,letterSpacing:"-0.04em",color:"#fff" }}>
            SAID
          </motion.div>
        </div>
        <div style={{ overflow:"hidden",marginBottom:8 }}>
          <motion.div initial={{ y:"108%" }} animate={{ y:"0%" }}
            transition={{ duration:1.05, delay:0.62, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:"Syne,sans-serif",fontWeight:800,
              fontSize:"clamp(60px,11vw,170px)",lineHeight:0.88,letterSpacing:"-0.04em",
              color:"transparent",WebkitTextStroke:"1.5px rgba(255,255,255,0.22)" }}>
            HUSSEIN
          </motion.div>
        </div>
        <div style={{ overflow:"hidden",marginBottom:38 }}>
          <motion.div initial={{ y:"108%" }} animate={{ y:"0%" }}
            transition={{ duration:1.05, delay:0.78, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:"Syne,sans-serif",fontWeight:800,
              fontSize:"clamp(60px,11vw,170px)",lineHeight:0.88,letterSpacing:"-0.04em",
              color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.1)" }}>
            ALLY
          </motion.div>
        </div>

        {/* Bottom info bar */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.05, duration:0.8 }}
          style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:20 }}>
          <div style={{ maxWidth:440 }}>
            <p style={{ fontFamily:"Inter,sans-serif",fontWeight:300,fontSize:15,color:"rgba(255,255,255,0.48)",lineHeight:1.78,margin:"0 0 16px" }}>
              I build <strong style={{ color:"rgba(255,255,255,0.85)",fontWeight:500 }}>clean, fast web products</strong> — full-stack from pixel to server. WhatsApp bots, web apps, and modern interfaces.
            </p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
              {["HTML","CSS","JavaScript","React","Three.js","Tailwind","Node.js","C++"].map(s=>(
                <span key={s} style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.36)",
                  border:"1px solid rgba(255,255,255,0.1)",padding:"3px 9px",borderRadius:2,letterSpacing:"0.05em" }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:22 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:50,color:"#fff",lineHeight:1,letterSpacing:"-0.04em" }}>{count}+</div>
              <div style={{ fontFamily:"Inter,sans-serif",fontSize:9,color:"rgba(255,255,255,0.26)",letterSpacing:"0.14em",textTransform:"uppercase" }}>Projects</div>
            </div>
            <button onClick={()=>document.getElementById("work")?.scrollIntoView({behavior:"smooth"})}
              style={{ width:58,height:58,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.22)",
                background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",
                color:"#fff",cursor:"none",transition:"all 0.25s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.45)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"; }}>
              <Ico.arrowUpRight s={18}/>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["React","Node.js","Three.js","Socket.io","Tailwind","C++","Full-Stack","JavaScript","WhatsApp Bots","Graphics","Tanzania"];
  const rep = [...items,...items,...items];
  return (
    <div style={{ overflow:"hidden",borderTop:"1px solid rgba(255,255,255,0.07)",
      borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"14px 0",background:"#060606" }}>
      <motion.div animate={{ x:["0%","-33.33%"] }} transition={{ duration:28,repeat:Infinity,ease:"linear" }}
        style={{ display:"flex",gap:52,whiteSpace:"nowrap",width:"max-content" }}>
        {rep.map((item,i)=>(
          <span key={i} style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",
            color: i%2===0 ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.05)" }}>
            {item}<span style={{ marginLeft:52,color:"rgba(255,255,255,0.04)" }}>—</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── IMAGE HEADER BAND ────────────────────────────────────────────────────────
// Cinematic full-width image strip that acts as a visual section header
function ImgHeader({ imgKey, label, sublabel, tall=false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-8%" });
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end","end start"] });
  const y = useTransform(scrollYProgress, [0,1], [-30, 30]); // subtle parallax

  return (
    <div ref={ref} style={{ position:"relative",width:"100%",height: tall ? 380 : 260,overflow:"hidden" }}>
      {/* Parallax image */}
      <motion.img src={IMG[imgKey]} alt={label}
        style={{ position:"absolute",inset:0,width:"100%",height:"130%",objectFit:"cover",objectPosition:"center",top:"-15%", y }}/>

      {/* Cinematic overlay */}
      <div style={{ position:"absolute",inset:0,
        background:"linear-gradient(to bottom,rgba(6,6,6,0.55) 0%,rgba(6,6,6,0.1) 40%,rgba(6,6,6,0.7) 85%,rgba(6,6,6,0.98) 100%)" }}/>

      {/* Left vignette */}
      <div style={{ position:"absolute",inset:0,
        background:"linear-gradient(to right,rgba(6,6,6,0.6) 0%,transparent 50%,rgba(6,6,6,0.3) 100%)" }}/>

      {/* Label text over image */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"0 36px 24px",display:"flex",alignItems:"flex-end",justifyContent:"space-between" }}>
        <motion.div initial={{ opacity:0,y:18 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.7,ease:[0.16,1,0.3,1] }}>
          <div style={{ fontFamily:"Inter,sans-serif",fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4 }}>{sublabel}</div>
          <div style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(22px,3.5vw,44px)",color:"#fff",letterSpacing:"-0.03em",lineHeight:1 }}>{label}</div>
        </motion.div>
        {/* Subtle corner line decoration */}
        <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.3 }}
          style={{ width:1,height:40,background:"rgba(255,255,255,0.18)",alignSelf:"stretch",margin:"auto 0" }}/>
      </div>
    </div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SLabel({ num, label, inView, extra }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ duration:0.5 }}
      style={{ display:"flex",alignItems:"center",gap:16,marginBottom:72 }}>
      <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",whiteSpace:"nowrap" }}>{num} — {label}</span>
      <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.07)" }}/>
      {extra && <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.15)" }}>{extra}</span>}
    </motion.div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-10%" });
  const stats = [
    { n:"4+",  label:"Projects Shipped" },
    { n:"3+",  label:"Years Building"   },
    { n:"8+",  label:"Tech Stacks"      },
    { n:"17",  label:"Years Old"        },
  ];

  return (
    <>
      {/* Cinematic image header for About */}
      <ImgHeader imgKey="coding_laptop" label="Said Hussein Ally" sublabel="About me — Full-Stack Developer" tall/>

      <section id="about" ref={ref} style={{ padding:"80px 36px 110px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"#060606" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <SLabel num="01" label="About" inView={inView}/>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"start" }}>
            <div>
              <div style={{ overflow:"hidden" }}>
                <motion.h2 initial={{ y:60,opacity:0 }} animate={inView?{y:0,opacity:1}:{}}
                  transition={{ duration:0.9,delay:0.1,ease:[0.16,1,0.3,1] }}
                  style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(34px,4vw,60px)",
                    lineHeight:1.05,letterSpacing:"-0.03em",color:"#fff",margin:"0 0 28px" }}>
                  Building with<br/><em style={{ color:"rgba(255,255,255,0.2)",fontStyle:"normal" }}>care and craft.</em>
                </motion.h2>
              </div>
              {[
                "I'm Said Hussein Ally — a 17-year-old full-stack developer from Tanzania. I build complete, production-ready web products that work across the whole stack.",
                "From pixel-perfect React interfaces to robust Node.js backends and WhatsApp bot platforms — I ship things that actually function well and look the part."
              ].map((txt,i)=>(
                <motion.p key={i} initial={{ opacity:0,y:14 }} animate={inView?{opacity:1,y:0}:{}}
                  transition={{ delay:0.25+i*0.12, duration:0.6 }}
                  style={{ fontFamily:"Inter,sans-serif",fontWeight:300,fontSize:14,lineHeight:1.82,color:"rgba(255,255,255,0.42)",margin:"0 0 16px" }}>
                  {txt}
                </motion.p>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)" }}>
              {stats.map((s,i)=>(
                <motion.div key={s.label} initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
                  transition={{ delay:0.15+i*0.09, duration:0.5 }}
                  style={{ padding:"32px 24px",background:"#060606",
                    borderBottom:i<2?"1px solid rgba(255,255,255,0.07)":"none",
                    borderRight:i%2===0?"1px solid rgba(255,255,255,0.07)":"none" }}>
                  <div style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:46,lineHeight:1,letterSpacing:"-0.04em",color:"#fff",marginBottom:6 }}>{s.n}</div>
                  <div style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.26)",letterSpacing:"0.1em",textTransform:"uppercase" }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── ADD PROJECT MODAL ────────────────────────────────────────────────────────
function AddModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ title:"",category:"",year:"2026",desc:"",stack:"",live:"",github:"https://github.com/abudharyally48-cloud" });
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd({
      id: String(Date.now()),
      title: form.title, category: form.category||"Project",
      year: form.year, desc: form.desc,
      stack: form.stack.split(",").map(s=>s.trim()).filter(Boolean),
      live: form.live||"#", github: form.github||"https://github.com/abudharyally48-cloud",
      headerImg: null,
    });
    setDone(true);
    setTimeout(()=>{ setDone(false); onClose(); }, 900);
  };

  const F = ({ label, k, ph, multi=false }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontFamily:"Inter,sans-serif",fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:"0.14em",textTransform:"uppercase",display:"block",marginBottom:6 }}>{label}</label>
      {multi
        ? <textarea value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph} rows={3}
            style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"10px 12px",fontFamily:"Inter,sans-serif",fontSize:13,resize:"vertical",borderRadius:2,boxSizing:"border-box",outline:"none" }}/>
        : <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}
            style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"10px 12px",fontFamily:"Inter,sans-serif",fontSize:13,borderRadius:2,boxSizing:"border-box",outline:"none" }}/>
      }
    </div>
  );

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(10px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale:0.93,y:28 }} animate={{ scale:1,y:0 }} exit={{ scale:0.93,y:28 }}
        style={{ background:"#0c0c0c",border:"1px solid rgba(255,255,255,0.1)",borderRadius:4,padding:"34px 30px",width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26 }}>
          <span style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:19,color:"#fff" }}>Add Project</span>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",padding:2 }}><Ico.x s={17}/></button>
        </div>
        <F label="Title"       k="title"    ph="e.g. My Portfolio"/>
        <F label="Category"    k="category" ph="e.g. Frontend, Platform"/>
        <F label="Year"        k="year"     ph="2026"/>
        <F label="Description" k="desc"     ph="What does it do?" multi/>
        <F label="Tech Stack"  k="stack"    ph="React, Node.js (comma separated)"/>
        <F label="Live URL"    k="live"     ph="https://..."/>
        <F label="GitHub URL"  k="github"   ph="https://github.com/..."/>
        <button onClick={submit}
          style={{ width:"100%",padding:"13px",background:done?"rgba(255,255,255,0.07)":"#fff",color:done?"#fff":"#060606",border:"none",borderRadius:2,
            fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.3s" }}>
          {done ? <><Ico.check s={15}/> Added!</> : "Add to Portfolio"}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── PROJECT CARD (with image header) ────────────────────────────────────────
function ProjectCard({ project, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-6%" });
  const [hovered,  setHovered]  = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const imgSrc = project.headerImg ? IMG[project.headerImg] : null;

  return (
    <>
      <motion.div ref={ref}
        initial={{ opacity:0,y:40 }} animate={inView?{opacity:1,y:0}:{}}
        transition={{ delay:index*0.1, duration:0.7, ease:[0.16,1,0.3,1] }}
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        style={{ border:"1px solid rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden",
          background:hovered?"rgba(255,255,255,0.022)":"transparent",
          transition:"background 0.35s, border-color 0.35s",
          borderColor:hovered?"rgba(255,255,255,0.13)":"rgba(255,255,255,0.07)",cursor:"none" }}>

        {/* IMAGE HEADER */}
        {imgSrc && (
          <div style={{ position:"relative",height:200,overflow:"hidden" }}>
            <motion.img src={imgSrc} alt={project.title}
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
              style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center" }}/>
            {/* Overlay */}
            <div style={{ position:"absolute",inset:0,
              background:"linear-gradient(to bottom,transparent 30%,rgba(6,6,6,0.92) 100%)" }}/>
            {/* Expand button */}
            <button onClick={()=>setLightbox(true)}
              style={{ position:"absolute",top:12,right:12,width:30,height:30,borderRadius:"50%",
                border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.5)",
                display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.6)",
                cursor:"none",transition:"all 0.2s",backdropFilter:"blur(4px)" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(0,0,0,0.8)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="rgba(0,0,0,0.5)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
              <Ico.expand s={12}/>
            </button>
            {/* Category badge */}
            <div style={{ position:"absolute",bottom:14,left:16,
              fontFamily:"Inter,sans-serif",fontSize:9,color:"rgba(255,255,255,0.4)",
              letterSpacing:"0.14em",textTransform:"uppercase" }}>
              {project.category} / {project.year}
            </div>
          </div>
        )}

        {/* CARD BODY */}
        <div style={{ padding:"20px 20px 22px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.18)",letterSpacing:"0.1em" }}>
                {typeof project.id==="string"&&project.id.length<=2 ? project.id : `0${index+1}`.slice(-2)}
              </span>
              <h3 style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(17px,2vw,24px)",
                letterSpacing:"-0.02em",color:"#fff",margin:0,lineHeight:1.05 }}>
                {project.title}
              </h3>
            </div>
            <div style={{ display:"flex",gap:6 }}>
              {[{ href:project.live, icon:<Ico.arrowUpRight s={13}/> },{ href:project.github, icon:<Ico.github s={13}/> }].map(({href,icon},i)=>(
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  style={{ width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",
                    border:"1px solid rgba(255,255,255,0.09)",borderRadius:"50%",
                    color:"rgba(255,255,255,0.3)",textDecoration:"none",transition:"all 0.2s",cursor:"none" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.4)"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"; e.currentTarget.style.color="rgba(255,255,255,0.3)"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <p style={{ fontFamily:"Inter,sans-serif",fontWeight:300,fontSize:13,lineHeight:1.75,color:"rgba(255,255,255,0.36)",margin:"0 0 14px",minHeight:56 }}>
            {project.desc}
          </p>

          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {project.stack.map(t=>(
              <span key={t} style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.28)",
                border:"1px solid rgba(255,255,255,0.08)",padding:"3px 9px",borderRadius:2,letterSpacing:"0.04em" }}>{t}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && imgSrc && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={()=>setLightbox(false)}
            style={{ position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.94)",
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
              padding:24,backdropFilter:"blur(8px)" }}>
            <motion.img src={imgSrc} alt={project.title}
              initial={{ scale:0.87 }} animate={{ scale:1 }} exit={{ scale:0.87 }}
              style={{ maxWidth:"90vw",maxHeight:"88vh",objectFit:"contain",borderRadius:3,
                border:"1px solid rgba(255,255,255,0.09)" }}/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-10%" });
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = (p) => setProjects(prev => [p, ...prev]);

  return (
    <>
      {/* Section image header */}
      <ImgHeader imgKey="coding_keyboard" label="Selected Work" sublabel="02 — My Projects"/>

      <section id="work" style={{ background:"#060606",borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"72px 36px 0" }} ref={ref}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:56,flexWrap:"wrap",gap:16 }}>
            <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
              style={{ display:"flex",alignItems:"center",gap:14,flex:1,minWidth:200 }}>
              <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",whiteSpace:"nowrap" }}>Projects</span>
              <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.07)" }}/>
              <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.14)" }}>{projects.length} total</span>
            </motion.div>
            <motion.button initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.3 }}
              onClick={()=>setShowModal(true)}
              style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",
                border:"1px solid rgba(255,255,255,0.14)",borderRadius:100,background:"transparent",
                color:"rgba(255,255,255,0.5)",fontFamily:"Syne,sans-serif",fontWeight:600,fontSize:11,
                letterSpacing:"0.06em",cursor:"none",transition:"all 0.2s",whiteSpace:"nowrap" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.38)"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.14)"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}>
              <Ico.plus s={12}/> Add Project
            </motion.button>
          </div>
        </div>

        {/* Project grid */}
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 36px 96px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20 }}>
          <AnimatePresence>
            {projects.map((p,i) => <ProjectCard key={p.id} project={p} index={i}/>)}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showModal && <AddModal onAdd={handleAdd} onClose={()=>setShowModal(false)}/>}
        </AnimatePresence>
      </section>
    </>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function Skills() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-10%" });
  const grouped = SKILLS_LIST.reduce((acc,s)=>{ (acc[s.type]=acc[s.type]||[]).push(s.name); return acc; }, {});

  return (
    <>
      <ImgHeader imgKey="wireframe" label="Tech Arsenal" sublabel="03 — Skills & Tools"/>
      <section id="skills" ref={ref} style={{ padding:"80px 36px 110px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"#060606" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <SLabel num="03" label="Skills" inView={inView}/>
          <div style={{ display:"grid",gridTemplateColumns:"260px 1fr",gap:72,alignItems:"start" }}>
            <motion.div initial={{ opacity:0,y:24 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.8,ease:[0.16,1,0.3,1] }}>
              <h2 style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(30px,3.5vw,50px)",lineHeight:1.08,letterSpacing:"-0.03em",color:"#fff",margin:"0 0 16px" }}>
                What I<br/><em style={{ color:"rgba(255,255,255,0.18)",fontStyle:"normal" }}>work with.</em>
              </h2>
              <p style={{ fontFamily:"Inter,sans-serif",fontWeight:300,fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,0.3)",margin:0 }}>
                Languages, frameworks, and tools across the full stack.
              </p>
            </motion.div>
            <div>
              {Object.entries(grouped).map(([type,names],gi,arr)=>(
                <motion.div key={type} initial={{ opacity:0,y:14 }} animate={inView?{opacity:1,y:0}:{}}
                  transition={{ delay:gi*0.1+0.2, duration:0.6 }}
                  style={{ display:"grid",gridTemplateColumns:"90px 1fr",gap:18,paddingBottom:18,
                    borderBottom:gi<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none",
                    marginBottom:gi<arr.length-1?18:0,alignItems:"start" }}>
                  <span style={{ fontFamily:"Inter,sans-serif",fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:"0.14em",textTransform:"uppercase",paddingTop:3 }}>{type}</span>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                    {names.map(name=>(
                      <span key={name} style={{ fontFamily:"Syne,sans-serif",fontWeight:600,fontSize:13,color:"rgba(255,255,255,0.58)",
                        padding:"5px 11px",border:"1px solid rgba(255,255,255,0.09)",borderRadius:2,transition:"all 0.2s",cursor:"default" }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.28)"; e.currentTarget.style.color="#fff"; }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"; e.currentTarget.style.color="rgba(255,255,255,0.58)"; }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-10%" });

  const links = [
    { label:"Email",      value:"azzahsaid532@gmail.com", href:"mailto:azzahsaid532@gmail.com",  icon:<Ico.mail s={15}/> },
    { label:"WhatsApp",   value:"+255 778 271 055",        href:"https://wa.me/255778271055",     icon:<Ico.whatsapp s={15}/> },
    { label:"WhatsApp",   value:"+255 680 639 278",        href:"https://wa.me/255680639278",     icon:<Ico.whatsapp s={15}/> },
    { label:"GitHub",     value:"abudharyally48-cloud",    href:"https://github.com/abudharyally48-cloud", icon:<Ico.github s={15}/> },
  ];

  return (
    <>
      <ImgHeader imgKey="buttons" label="Get In Touch" sublabel="04 — Contact"/>
      <section id="contact" ref={ref} style={{ padding:"80px 36px 80px",background:"#060606" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <SLabel num="04" label="Contact" inView={inView}/>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"end" }}>
            <div>
              {["Let's","build."].map((word,i)=>(
                <div key={word} style={{ overflow:"hidden",marginBottom:i===0?-6:36 }}>
                  <motion.div initial={{ y:"108%" }} animate={inView?{y:"0%"}:{}}
                    transition={{ duration:0.95,delay:0.1+i*0.13,ease:[0.16,1,0.3,1] }}
                    style={{ fontFamily:"Syne,sans-serif",fontWeight:800,
                      fontSize:"clamp(50px,8vw,108px)",lineHeight:0.92,letterSpacing:"-0.04em",
                      color:i===0?"#fff":"transparent",
                      WebkitTextStroke:i===1?"1.5px rgba(255,255,255,0.17)":"none" }}>
                    {word}
                  </motion.div>
                </div>
              ))}
              <motion.p initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.5 }}
                style={{ fontFamily:"Inter,sans-serif",fontWeight:300,fontSize:14,lineHeight:1.8,
                  color:"rgba(255,255,255,0.35)",margin:0,maxWidth:340 }}>
                Have a project, idea, or collab in mind? I'm open to freelance work and interesting builds. Both numbers are on WhatsApp.
              </motion.p>
            </div>

            <motion.div initial={{ opacity:0,y:24 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:0.3,duration:0.7 }}
              style={{ display:"flex",flexDirection:"column",gap:1,background:"rgba(255,255,255,0.06)" }}>
              {links.map(({ label,value,href,icon },i)=>(
                <a key={i} href={href} target={href.startsWith("http")?"_blank":undefined} rel="noreferrer"
                  style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 22px",
                    background:"#060606",color:"#fff",textDecoration:"none",transition:"background 0.25s",cursor:"none" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                  onMouseLeave={e=>e.currentTarget.style.background="#060606"}>
                  <div>
                    <div style={{ fontFamily:"Inter,sans-serif",fontSize:9,color:"rgba(255,255,255,0.22)",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4 }}>{label}</div>
                    <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:15,letterSpacing:"-0.01em",color:"#fff" }}>{value}</div>
                  </div>
                  <span style={{ color:"rgba(255,255,255,0.28)" }}>{icon}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding:"18px 36px",borderTop:"1px solid rgba(255,255,255,0.07)",
      display:"flex",justifyContent:"space-between",alignItems:"center",background:"#060606",flexWrap:"wrap",gap:8 }}>
      <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:"0.08em" }}>© 2026 Said Hussein Ally — Tanzania</span>
      <span style={{ fontFamily:"Inter,sans-serif",fontSize:10,color:"rgba(255,255,255,0.15)",letterSpacing:"0.08em" }}>Designed & built from scratch</span>
    </footer>
  );
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#060606; overflow-x:hidden; cursor:none; }
  input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.2); }
  input, textarea { color-scheme:dark; }
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:#060606; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
  @media (max-width:767px) {
    body { cursor:auto; }
    .desk-nav { display:none !important; }
    .mob-btn  { display:flex !important; }
  }
  @media (max-width:680px) {
    [data-grid="two"] { grid-template-columns:1fr !important; gap:36px !important; }
    [data-grid="skill"] { grid-template-columns:1fr !important; gap:32px !important; }
  }
`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    document.body.style.background = "#060606";
    return () => { try { document.head.removeChild(s); } catch(e){} };
  }, []);

  return (
    <div style={{ background:"#060606",minHeight:"100vh",color:"#fff" }}>
      <Cursor/>
      <Navbar/>
      <main>
        <Hero/>
        <Marquee/>
        <About/>
        <Projects/>
        <Skills/>
        <Contact/>
      </main>
      <Footer/>
    </div>
  );
}
