import React, { useState, useEffect } from "react";

// ─── Moment data ───────────────────────────────────────────────────────────
const MOMENTS = [
  {
    id: "arrivals",
    number: 1,
    name: "Guest Arrivals",
    description: "The first musical impression of the day",
    detail:
      "Before your ceremony begins, your guests arrive and settle in. The music playing in those 20–30 minutes sets the emotional register for everything that follows. Most couples have never thought about this moment.",
    warmth: 1, // 1 = coolest, 5 = warmest
  },
  {
    id: "ceremony",
    number: 2,
    name: "Ceremony",
    description: "The moment everyone watches in silence",
    detail:
      "Every processional song, the signing moment, the recessional — this is the most emotionally charged musical hour of your day. Get it right and your guests will notice.",
    warmth: 2,
  },
  {
    id: "predrinks",
    number: 3,
    name: "Pre-drinks",
    description: "Where the day's energy is set — the drinks reception between your ceremony and dinner",
    detail:
      "The first hour after the ceremony is where your day finds its rhythm. Live act or DJ? Background or featured? Are you there for photos, or mingling with your guests? Each answer changes the recommendation.",
    warmth: 3,
  },
  {
    id: "entrance",
    number: 4,
    name: "Your Entrance",
    description: "The transition into the reception",
    detail:
      "The moment your MC announces you into the room. One song. Thirty seconds. The most theatrically impactful moment of the evening — and the most underplanned.",
    warmth: 3,
  },
  {
    id: "dinner",
    number: 5,
    name: "Dinner",
    description: "90 minutes that carry the evening forward",
    detail:
      "Background warmth or building energy? Live act or playlist? Whether you want conversations to flow or the room to start buzzing toward dancing — the dinner set is where that arc is managed.",
    warmth: 3,
  },
  {
    id: "speeches",
    number: 6,
    name: "Speeches",
    description: "Where personalisation lives",
    detail:
      "Most couples never think about intro music for speeches. The right 10 seconds before a father's toast or a best friend's roast changes the entire emotional frame of what follows.",
    warmth: 3,
  },
  {
    id: "firstdance",
    number: 7,
    name: "First Dance",
    description: "Your first 3 minutes as a married couple",
    detail:
      "Live or from a recording? Original or cover? Do you want the floor to erupt when you finish, or a gentle transition? This moment deserves more thought than most couples give it.",
    warmth: 4,
  },
  {
    id: "dancing",
    number: 8,
    name: "Dancing",
    description: "The arc that guests remember most",
    detail:
      "The energy arc of your dance floor — when does it peak, when does it breathe, how does it close? This is where your music plan either delivers or disappoints.",
    warmth: 5,
  },
  {
    id: "lastsong",
    number: 9,
    name: "Last Song",
    description: "The emotional punctuation mark of the day",
    detail:
      "The last thing your guests hear as they leave. Most couples don't choose it. Those who do never forget it.",
    warmth: 4,
  },
];

// ─── Warmth → colour mapping ───────────────────────────────────────────────
const WARMTH_COLORS = {
  1: { node: "#4A7B9D", glow: "rgba(74,123,157,0.25)", label: "cool" },
  2: { node: "#5B8FA8", glow: "rgba(91,143,168,0.25)", label: "soft" },
  3: { node: "#8B7355", glow: "rgba(139,115,85,0.25)", label: "warm" },
  4: { node: "#C4922A", glow: "rgba(196,146,42,0.3)", label: "golden" },
  5: { node: "#B85C38", glow: "rgba(184,92,56,0.3)", label: "peak" },
};

// ─── Status chip ───────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const styles = {
    confirmed: {
      bg: "rgba(196,146,42,0.12)",
      text: "#C4922A",
      label: "Confirmed",
    },
    complete: {
      bg: "#1C2B3A",
      text: "#FAF7F2",
      label: "Complete",
    },
    "in-progress": {
      bg: "rgba(196,146,42,0.12)",
      text: "#C4922A",
      label: "In progress",
    },
    locked: {
      bg: "rgba(28,43,58,0.06)",
      text: "#6B6560",
      label: "Not started",
    },
  };
  const s = styles[status] || styles.locked;
  const isConfirmed = status === "confirmed";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 100,
        background: s.bg,
        fontSize: 11,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        color: s.text,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {isConfirmed ? (
        <svg width="9" height="9" fill="none" viewBox="0 0 9 9" style={{ flexShrink: 0 }}>
          <path d="M1.5 4.5l2 2 4-4" stroke="#C4922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: status === "complete" ? "#C4922A" : status === "in-progress" ? "#C4922A" : "#6B6560",
            flexShrink: 0,
          }}
        />
      )}
      {s.label}
    </span>
  );
}

// ─── Single moment card ────────────────────────────────────────────────────
function MomentCard({ moment, status, isActive, isPaid, onClick, index }) {
  const color = WARMTH_COLORS[moment.warmth];
  const isLocked = !isPaid && status === "locked";
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: "unset",
        boxSizing: "border-box",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        background: isActive
          ? "#FFFFFF"
          : hovered
          ? "#FFFFFF"
          : "rgba(255,255,255,0.6)",
        borderRadius: 16,
        padding: "24px 24px 22px",
        border: isActive
          ? `1.5px solid ${color.node}`
          : `1.5px solid rgba(28,43,58,${hovered ? "0.12" : "0.07"})`,
        boxShadow: isActive
          ? `0 8px 32px ${color.glow}, 0 2px 8px rgba(28,43,58,0.06)`
          : hovered
          ? "0 8px 24px rgba(28,43,58,0.08), 0 2px 6px rgba(28,43,58,0.04)"
          : "0 2px 8px rgba(28,43,58,0.04)",
        transition: "all 200ms ease",
        transform: isActive || hovered ? "translateY(-2px)" : "translateY(0)",
        opacity: isLocked ? 0.65 : 1,
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        minWidth: 0,
        flex: "0 0 auto",
        width: "100%",
        animation: `fadeSlideIn 350ms ease both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Warm accent strip on active */}
      {isActive && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color.node}, transparent)`,
            borderRadius: "16px 16px 0 0",
          }}
        />
      )}

      {/* Gold left strip on confirmed */}
      {status === "confirmed" && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#C4922A",
            borderRadius: "16px 0 0 16px",
          }}
        />
      )}

      {/* Number + status row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: isActive ? color.node : `${color.node}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            color: isActive ? "#FAF7F2" : color.node,
            flexShrink: 0,
            transition: "all 200ms ease",
          }}
        >
          {isLocked ? (
            <svg width="11" height="12" fill="none" viewBox="0 0 11 12">
              <path
                d="M8.5 5H8V3.5a2.5 2.5 0 0 0-5 0V5h-.5A1 1 0 0 0 1.5 6v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm-2.5 3.5a.5.5 0 1 1-1 0V7a.5.5 0 0 1 1 0v1.5zm1-3.5H4V3.5a1.5 1.5 0 0 1 3 0V5z"
                fill={color.node}
              />
            </svg>
          ) : (
            moment.number
          )}
        </span>
        <StatusChip status={status} />
      </div>

      {/* Name */}
      <h3
        style={{
          margin: "0 0 4px",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18,
          fontWeight: 500,
          color: "#1C2B3A",
          lineHeight: 1.2,
        }}
      >
        {moment.name}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "#6B6560",
          lineHeight: 1.5,
        }}
      >
        {moment.description}
      </p>
    </button>
  );
}

// ─── Expanded moment detail panel ──────────────────────────────────────────
function MomentDetail({ moment, status, isPaid, onClose, onUnlock, onStart, inOverlay = false, isUnlocking = false }) {
  const color = WARMTH_COLORS[moment.warmth];
  const isLocked = !isPaid && status === "locked";

  return (
    <div
      style={inOverlay ? { flex: 1, display: "flex", flexDirection: "column" } : {
        background: "#FFFFFF",
        borderRadius: 20,
        border: `1.5px solid ${color.node}33`,
        boxShadow: `0 16px 48px ${color.glow}, 0 4px 16px rgba(28,43,58,0.08)`,
        overflow: "hidden",
        animation: "expandIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
      }}
    >
      {/* Coloured header bar */}
      <div
        style={{
          background: `linear-gradient(135deg, ${color.node}18, ${color.node}08)`,
          borderBottom: `1px solid ${color.node}22`,
          padding: "24px 24px 20px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            all: "unset",
            cursor: "pointer",
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(28,43,58,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6B6560",
            fontSize: 16,
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: color.node,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              color: "#FAF7F2",
            }}
          >
            {moment.number}
          </span>
          <StatusChip status={status} />
        </div>
        <h2
          style={{
            margin: "0 0 4px",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            fontWeight: 500,
            color: "#1C2B3A",
            lineHeight: 1.2,
          }}
        >
          {moment.name}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#6B6560",
            fontStyle: "italic",
          }}
        >
          {moment.description}
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px" }}>
        <p
          style={{
            margin: "0 0 20px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#2C2C2C",
            lineHeight: 1.7,
          }}
        >
          {moment.detail}
        </p>

        {isLocked ? (
          <button
            onClick={onUnlock}
            disabled={isUnlocking}
            style={{
              all: "unset",
              cursor: isUnlocking ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "14px 24px",
              background: "#1C2B3A",
              color: "#FAF7F2",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              boxSizing: "border-box",
              transition: "all 200ms ease",
              opacity: isUnlocking ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (isUnlocking) return;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(28,43,58,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isUnlocking ? 'Setting up…' : 'Open this moment'}
            {!isUnlocking && (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path
                  d="M8 1l7 7-7 7M1 8h14"
                  stroke="#FAF7F2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ) : (
          <button
            onClick={onStart}
            style={{
              all: "unset",
              boxSizing: "border-box",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "14px 28px",
              minHeight: 44,
              background: "#1C2B3A",
              color: "#FAF7F2",
              borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 200ms ease",
            }}
          >
            {status === "complete" || status === "confirmed" ? "Review this moment" : "Plan this moment"}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path
                d="M8 1l7 7-7 7M1 8h14"
                stroke="#FAF7F2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Overlay wrapper — bottom sheet (mobile) / right drawer (desktop) ──────
function MomentOverlay({ moment, status, isPaid, onClose, onUnlock, onMomentStart, isUnlocking = false }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const panelStyle = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "65vh",
        background: "#FFFFFF",
        borderRadius: "20px 20px 0 0",
        zIndex: 101,
        animation: "slideUp 300ms ease both",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }
    : {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        background: "#FFFFFF",
        zIndex: 101,
        animation: "slideInRight 300ms ease both",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
          animation: "overlayFadeIn 300ms ease both",
        }}
      />

      {/* Panel */}
      <div style={panelStyle}>
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "12px 0 4px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: "rgba(28,43,58,0.15)",
              }}
            />
          </div>
        )}
        <MomentDetail
          moment={moment}
          status={status}
          isPaid={isPaid}
          onClose={onClose}
          onUnlock={onUnlock}
          onStart={() => onMomentStart(moment.id)}
          inOverlay={true}
          isUnlocking={isUnlocking}
        />
      </div>
    </>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────────────
function ProgressBar({ completed, total }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 3,
          background: "rgba(28,43,58,0.08)",
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #1C2B3A, #C4922A)",
            borderRadius: 100,
            transition: "width 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "#6B6560",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {completed} of {total}
      </span>
    </div>
  );
}

// ─── Unlock CTA banner ─────────────────────────────────────────────────────
function UnlockBanner({ onUnlock, completedCount, isUnlocking = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "24px",
        marginTop: 8,
        border: "1px solid rgba(28,43,58,0.06)",
        borderLeft: "3px solid #C4922A",
        boxShadow: "0 4px 24px rgba(28,43,58,0.07), 0 1px 4px rgba(28,43,58,0.04)",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20,
          fontWeight: 500,
          color: "#1C2B3A",
          lineHeight: 1.3,
        }}
      >
        Your music plan covers 9 moments.
      </p>
      <p
        style={{
          margin: "0 0 20px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#6B6560",
          lineHeight: 1.5,
        }}
      >
        Complete each one to build your full brief — the document your planner
        and every act will work from.
      </p>

      <button
        onClick={onUnlock}
        disabled={isUnlocking}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          all: "unset",
          cursor: isUnlocking ? "default" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 24px",
          background: hovered && !isUnlocking ? "#2d4a63" : "#1C2B3A",
          color: "#FAF7F2",
          borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          transition: "all 200ms ease",
          transform: hovered && !isUnlocking ? "translateY(-1px)" : "translateY(0)",
          boxShadow: hovered && !isUnlocking
            ? "0 8px 24px rgba(28,43,58,0.2)"
            : "0 4px 12px rgba(28,43,58,0.12)",
          opacity: isUnlocking ? 0.7 : 1,
        }}
      >
        {isUnlocking ? 'Setting up…' : 'Start planning →'}
        {!isUnlocking && (
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path
              d="M8 1l7 7-7 7M1 8h14"
              stroke="#FAF7F2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Main MomentMap component ──────────────────────────────────────────────
export default function MomentMap({
  // Props the parent passes in
  coupleName = "Sarah & James",
  completedMoments = [], // array of moment IDs that are 'complete'
  confirmedMoments = [], // array of moment IDs that are 'confirmed'
  inProgressMoments = [], // array of moment IDs that are 'in-progress'
  isPaid = false, // false = show locked state + unlock CTA
  isUnlocking = false, // true while Stripe redirect is in flight
  onUnlock = () => {}, // called when couple clicks unlock / pay
  onMomentStart = () => {}, // called with moment.id when a paid moment is started
  onGenerateBrief = () => {}, // called when all moments confirmed and couple clicks generate
}) {
  const [activeMoment, setActiveMoment] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatus = (momentId) => {
    if (confirmedMoments.includes(momentId)) return "confirmed";
    if (completedMoments.includes(momentId)) return "complete";
    if (inProgressMoments.includes(momentId)) return "in-progress";
    return "locked";
  };

  const completedCount = completedMoments.length;
  const confirmedCount = confirmedMoments.length;

  const handleMomentClick = (moment) => {
    if (activeMoment?.id === moment.id) {
      setActiveMoment(null);
    } else {
      setActiveMoment(moment);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        * { box-sizing: border-box; }
        :root {
          --cream: #FAF7F2;
          --navy: #1C2B3A;
          --gold: #C4922A;
          --grey: #6B6560;
          --white: #FFFFFF;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#FAF7F2",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "32px 24px 0",
            maxWidth: 640,
            margin: "0 auto",
            animation: "fadeSlideIn 400ms ease both",
          }}
        >
          {/* Back link */}
          <button
            style={{
              all: "unset",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#6B6560",
              marginBottom: 24,
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
              <path
                d="M9 1L3 7l6 6"
                stroke="#6B6560"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Your portrait
          </button>

          {/* Title block */}
          <p
            style={{
              margin: "0 0 4px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#C4922A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {coupleName}
          </p>
          <h1
            style={{
              margin: "0 0 8px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              fontWeight: 400,
              color: "#1C2B3A",
              lineHeight: 1.15,
            }}
          >
            Your music map
          </h1>
          <p
            style={{
              margin: "0 0 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#6B6560",
              lineHeight: 1.6,
            }}
          >
            Every musical moment of your day, mapped and planned. Each
            conversation takes about 5 minutes.
          </p>

          {/* Progress */}
          <ProgressBar completed={completedCount} total={MOMENTS.length} />
          <p
            style={{
              margin: "0 0 28px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#6B6560",
            }}
          >
            {completedCount === 0
              ? "Start with any moment — we'll suggest the best order."
              : completedCount === MOMENTS.length
              ? "Your music plan is complete. Ready to generate your brief."
              : `${MOMENTS.length - completedCount} moments remaining. Your brief grows with each one.`}
          </p>

          {/* ── Unlock CTA (pre-payment only) ───────────────────────── */}
          {!isPaid && (
            <div
              style={{
                marginTop: 24,
                marginBottom: 24,
                animation: "fadeSlideIn 500ms ease 560ms both",
              }}
            >
              <UnlockBanner onUnlock={onUnlock} completedCount={completedCount} isUnlocking={isUnlocking} />
            </div>
          )}
        </div>

        {/* ── Moment cards ──────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {/* Desktop: 2-col grid; Mobile: single col */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {MOMENTS.map((moment, index) => {
              const status = getStatus(moment.id);
              return (
                <div
                  key={moment.id}
                  style={moment.id === "lastsong" ? { gridColumn: "1 / -1" } : undefined}
                >
                  <MomentCard
                    moment={moment}
                    status={status}
                    isActive={activeMoment?.id === moment.id}
                    isPaid={isPaid}
                    onClick={() => handleMomentClick(moment)}
                    index={index}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Generate brief CTA (post-payment, all complete) ─────── */}
          {isPaid && completedCount === MOMENTS.length && (
            <div
              style={{
                marginTop: 24,
                padding: "24px",
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1.5px solid rgba(28,43,58,0.08)",
                textAlign: "center",
                animation: "fadeSlideIn 400ms ease both",
              }}
            >
              {confirmedCount === MOMENTS.length ? (
                <>
                  <p
                    style={{
                      margin: "0 0 16px",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22,
                      color: "#1C2B3A",
                    }}
                  >
                    All 9 moments confirmed. Your brief is ready to build.
                  </p>
                  <button
                    onClick={onGenerateBrief}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "14px 32px",
                      background: "#1C2B3A",
                      color: "#FAF7F2",
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Build my brief →
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M8 1l7 7-7 7M1 8h14"
                        stroke="#FAF7F2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "#6B6560",
                    lineHeight: 1.6,
                  }}
                >
                  Complete and confirm all 9 moments to build your brief.
                </p>
              )}
            </div>
          )}

          <div style={{ height: 48 }} />
        </div>
      </div>

      {activeMoment && (
        <MomentOverlay
          moment={activeMoment}
          status={getStatus(activeMoment.id)}
          isPaid={isPaid}
          onClose={() => setActiveMoment(null)}
          onUnlock={onUnlock}
          onMomentStart={onMomentStart}
          isUnlocking={isUnlocking}
        />
      )}
    </>
  );
}
