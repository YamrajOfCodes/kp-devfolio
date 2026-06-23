import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../components/PageTransition";

// ─────────────────────────────────────────────────────────────────────────
// ASSETS — SnapSense doesn't have a big screenshot set, so this page only
// needs one optional cover image for the hero. Swap the path below, or
// delete the <OptionalScreenshot /> block entirely if you have none.
// ─────────────────────────────────────────────────────────────────────────
import snapSenseScreenshot from "../assets/ImageInteraction/snapsense.jpg";
// Cover image for whichever case study comes after this one in your portfolio
import nextProjectCover from "../assets/ImageInteraction/snapsense.jpg";

const CREAM = "#EAE4D5";
const ORANGE = "#E8400C";
const E = [0.16, 1, 0.3, 1];

const TECH_STACK = [
  { name: "React", role: "UI library" },
  { name: "Tailwind CSS", role: "Styling" },
  { name: "Zustand", role: "Client-side state management" },
  { name: "React Query", role: "Async state, caching & mutations" },
  { name: "InstantDB", role: "Real-time data sync" },
  { name: "Material UI", role: "Grid system" },
];

const CHALLENGES = [
  {
    n: "01",
    h: "One reaction per user, per image — unlimited comments on the same layer.",
    problem:
      "Reactions needed to be capped at one per user per image, while comments stayed unlimited, on top of the same real-time data layer.",
    solution:
      "Before inserting a reaction, the app checks for an existing reaction from that user on that image and updates it in place instead of inserting a duplicate — preventing reaction spam while keeping the feed real-time.",
  },
  {
    n: "02",
    h: "Keeping every client in sync without flicker or duplicates.",
    problem:
      "Reactions and comments needed to update instantly across every connected user, without duplicate entries or visible flicker while a write was still in flight.",
    solution:
      "InstantDB's real-time subscriptions handle the sync layer, React Query manages cache invalidation and the mutation lifecycle, and optimistic updates render the change immediately while confirmation catches up in the background.",
  },
];

const SCHEMA_CODE = `export const schema = i.schema({
  entities: {
    reactions: i.entity({
      imageId: i.string(),
      userName: i.string(),
      emojis: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
    comments: i.entity({
      userName: i.string(),
      imageId: i.string(),
      text: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
});`;

// ─────────────────────────────────────────────────────────────────────────
// Shared helpers — same pattern as the other case study pages.
// Worth extracting into a shared file once you've built a few of these.
// ─────────────────────────────────────────────────────────────────────────
function useFade(margin = "-60px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

function Label({ children }) {
  return (
    <p
      className="text-[10px] tracking-[0.4em] uppercase mb-4"
      style={{
        color: `${ORANGE}90`,
        fontWeight: 300,
        fontFamily: "'Geist', sans-serif",
      }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2
      className="leading-tight mb-6"
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        color: CREAM,
      }}>
      {children}
    </h2>
  );
}

function Body({ children, className = "" }) {
  return (
    <p
      className={`leading-loose max-w-[62ch] ${className}`}
      style={{
        fontFamily: "'Geist', sans-serif",
        fontWeight: 300,
        fontSize: "0.95rem",
        color: "rgba(234,228,213,0.5)",
      }}>
      {children}
    </p>
  );
}

function Fade({ children, delay = 0, className = "" }) {
  const { ref, inView } = useFade();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: E, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

function Rule() {
  const { ref, inView } = useFade();
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.0, ease: E }}
      className="h-px origin-left my-16 sm:my-20 mx-6 sm:mx-10 lg:mx-20"
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

// One optional screenshot — used in place of a full gallery, since this
// project doesn't have a large set of product screens to show off.
function OptionalScreenshot({ src, alt, caption }) {
  return (
    <Fade>
      <div className="flex flex-col gap-2">
        <div
          className="w-full rounded-sm overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "#0e0e0e",
          }}>
          <img src={src} alt={alt} className="w-full h-full object-cover block" />
        </div>
        {caption && (
          <p
            className="text-[9px] tracking-[0.2em] uppercase opacity-20"
            style={{ fontFamily: "'Geist', sans-serif" }}>
            {caption}
          </p>
        )}
      </div>
    </Fade>
  );
}

// Hand-built architecture diagram standing in for product screenshots —
// shows the real-time sync flow at a glance.
function SyncFlowDiagram() {
  const steps = [
    "User Reacts / Comments",
    "Optimistic Update (Zustand + React Query)",
    "InstantDB Sync Engine",
    "Live Update on Every Client",
  ];

  return (
    <Fade>
      <div
        className="w-full rounded-sm p-6 sm:p-10 overflow-x-auto"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "#0e0e0e",
        }}>
        <svg
          viewBox="0 0 1040 200"
          className="w-full min-w-[640px]"
          xmlns="http://www.w3.org/2000/svg">
          {steps.map((label, i) => {
            const x = i * 280 + 20;
            return (
              <g key={label}>
                <rect
                  x={x}
                  y={60}
                  width={220}
                  height={80}
                  rx={4}
                  fill="none"
                  stroke={i === 2 ? ORANGE : "rgba(234,228,213,0.25)"}
                  strokeWidth="1.2"
                />
                <text
                  x={x + 110}
                  y={94}
                  textAnchor="middle"
                  fontFamily="Geist, sans-serif"
                  fontSize="12"
                  fontWeight="400"
                  fill={CREAM}>
                  {label.split(" ").slice(0, 3).join(" ")}
                </text>
                <text
                  x={x + 110}
                  y={112}
                  textAnchor="middle"
                  fontFamily="Geist, sans-serif"
                  fontSize="12"
                  fontWeight="400"
                  fill={CREAM}>
                  {label.split(" ").slice(3).join(" ")}
                </text>
                {i < steps.length - 1 && (
                  <path
                    d={`M${x + 222} 100 L${x + 268} 100`}
                    stroke="rgba(234,228,213,0.3)"
                    strokeWidth="1.2"
                    markerEnd="url(#arrowhead)"
                  />
                )}
              </g>
            );
          })}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill="rgba(234,228,213,0.3)" />
            </marker>
          </defs>
        </svg>
      </div>
    </Fade>
  );
}

export default function SnapSense() {
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  return (
    <div
      className="min-h-screen w-full bg-[#0a0a0a]"
      style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Geist:wght@200;300;400&display=swap"
      />

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-5 sm:py-6"
        style={{
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
        <button
          onClick={() => navigate("/")}
          className="text-[10px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity duration-200"
          style={{ color: CREAM, fontWeight: 300 }}>
          ← Back
        </button>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          SnapSense / Case Study
        </span>
      </nav>

      {/* HERO */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        <div className="relative" style={{ zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.1 }}
            className="text-[10px] tracking-[0.4em] uppercase mb-6 sm:mb-8"
            style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
            Engineering · Real-Time Sync
          </motion.p>

          <div className="overflow-hidden mb-4 sm:mb-6">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.0, ease: E, delay: 0.15 }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(3.5rem, 13vw, 12rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: CREAM,
              }}>
              SnapSense
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: E, delay: 0.3 }}
            className="text-base sm:text-xl font-light leading-relaxed max-w-[52ch] mb-10 sm:mb-14"
            style={{ color: "rgba(234,228,213,0.5)" }}>
            A scalable, real-time image interaction layer — users react with
            emojis and drop comments on shared images, with every change
            propagating live, no traditional backend required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.4 }}
            className="flex items-center gap-3 mb-12 sm:mb-16">
            {/* Primary — Live URL. Replace with your deployed link. */}
            <a
              href="https://real-time-image-interaction.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                background: ORANGE,
                color: "#080808",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.12em",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2" fill="#080808" />
                <circle cx="6" cy="6" r="5" stroke="#080808" strokeWidth="1" />
                <path
                  d="M4 6c0-1.1.4-2.1 1-2.8M8 6c0 1.1-.4 2.1-1 2.8M3 6h6M3.5 4h5M3.5 8h5"
                  stroke="#080808"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </svg>
              Live Site
            </a>

            {/* Secondary — GitHub. Replace with your repo link. */}
            <a
              href="https://github.com/YamrajOfCodes/Real-Time-Image-Interaction"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                background: "transparent",
                color: "rgba(234,228,213,0.55)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.12em",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                e.currentTarget.style.color = "rgba(234,228,213,0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(234,228,213,0.55)";
              }}>
              <svg width="20" height="20" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 1a5.5 5.5 0 00-1.739 10.716c.275.05.376-.119.376-.265 0-.131-.005-.477-.008-.936-1.531.333-1.854-.738-1.854-.738-.25-.636-.611-.805-.611-.805-.5-.341.038-.334.038-.334.552.039.843.567.843.567.491.841 1.288.598 1.602.457.05-.355.192-.598.35-.735-1.222-.139-2.508-.611-2.508-2.72 0-.601.215-1.092.567-1.477-.057-.138-.246-.699.054-1.457 0 0 .462-.148 1.513.564a5.27 5.27 0 011.379-.186c.467.002.938.063 1.378.186 1.05-.712 1.511-.564 1.511-.564.301.758.112 1.319.055 1.457.353.385.566.876.566 1.477 0 2.115-1.288 2.58-2.514 2.716.198.17.374.506.374 1.02 0 .736-.007 1.329-.007 1.51 0 .147.099.318.378.264A5.501 5.501 0 006.5 1z"
                  fill="currentColor"
                />
              </svg>
              GitHub
            </a>
          </motion.div>

          {/* Quick facts — stand in for a screenshot row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: E, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 sm:gap-10 max-w-[44rem] pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { k: "Zero", v: "Custom backend" },
              { k: "Live", v: "Cross-client sync" },
              { k: "1:1", v: "Reaction-to-user cap" },
            ].map(({ k, v }) => (
              <div key={v}>
                <p
                  className="mb-1"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    color: ORANGE,
                  }}>
                  {k}
                </p>
                <p
                  className="text-[10px] tracking-[0.15em] uppercase"
                  style={{ color: "rgba(234,228,213,0.4)", fontWeight: 300 }}>
                  {v}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Rule />

      {/* Optional single screenshot — delete this section if you don't have one */}
      <section className="px-6 sm:px-10 lg:px-20 mb-4">
        <OptionalScreenshot
          src={snapSenseScreenshot}
          alt="SnapSense reaction and comment view"
          caption="Reaction & comment view"
        />
      </section>

      <Rule />

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade className="mb-8 sm:mb-10">
          <Label>How It Works</Label>
          <SectionHeading>No backend. Still real-time.</SectionHeading>
          <Body>
            SnapSense skips the traditional REST layer entirely — client-side
            mutations and subscriptions talk to InstantDB directly. Real-time
            subscriptions keep reactions and comments in sync across every
            connected user, optimistic updates keep the UI responsive while
            that sync catches up, and React Query manages the async state and
            mutation lifecycle instead of hand-rolled loading and error
            states. It cut backend complexity considerably, at the cost of
            having to handle real-time conflicts carefully — especially
            around reactions.
          </Body>
        </Fade>
        <SyncFlowDiagram />
      </section>

      <Rule />

      {/* ── TECH STACK ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade className="mb-8 sm:mb-10">
          <Label>Tech Stack</Label>
          <SectionHeading>Six tools, one real-time core.</SectionHeading>
        </Fade>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          {TECH_STACK.map(({ name, role }) => (
            <Fade key={name}>
              <div className="p-5 sm:p-6 h-full" style={{ background: "#0a0a0a" }}>
                <p
                  className="mb-1.5"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.01em",
                    color: CREAM,
                  }}>
                  {name}
                </p>
                <p
                  className="text-xs font-light"
                  style={{ color: "rgba(234,228,213,0.4)" }}>
                  {role}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── DATA LAYER / SCHEMA ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade className="mb-8 sm:mb-10">
          <Label>Data Layer</Label>
          <SectionHeading>Two entities. No server in between.</SectionHeading>
          <Body>
            The entire data model lives in InstantDB's schema — a{" "}
            <span style={{ color: "rgba(234,228,213,0.7)" }}>reactions</span>{" "}
            entity and a{" "}
            <span style={{ color: "rgba(234,228,213,0.7)" }}>comments</span>{" "}
            entity, both keyed against an image and a user, with everything
            else (sync, caching, conflict handling) layered on top in the
            client.
          </Body>
        </Fade>
        <Fade delay={0.1}>
          <pre
            className="w-full overflow-x-auto rounded-sm p-5 sm:p-7 text-xs sm:text-[13px] leading-relaxed"
            style={{
              background: "#0e0e0e",
              border: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "'Geist Mono', 'Geist', monospace",
              color: "rgba(234,228,213,0.75)",
            }}>
            <code>{SCHEMA_CODE}</code>
          </pre>
        </Fade>
      </section>

      <Rule />

      {/* ── CHALLENGES & SOLUTIONS ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade className="mb-8 sm:mb-10">
          <Label>Challenges & Solutions</Label>
          <SectionHeading>Where the real work happened.</SectionHeading>
        </Fade>
        <div className="flex flex-col gap-10 sm:gap-12">
          {CHALLENGES.map(({ n, h, problem, solution }) => (
            <Fade key={n}>
              <div className="flex gap-5 sm:gap-8">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase shrink-0 mt-1"
                  style={{ color: `${ORANGE}60`, fontWeight: 300 }}>
                  {n}
                </span>
                <div className="max-w-[62ch]">
                  <p className="text-sm font-normal mb-3" style={{ color: CREAM }}>
                    {h}
                  </p>
                  <p
                    className="text-sm font-light leading-loose mb-2"
                    style={{ color: "rgba(234,228,213,0.4)" }}>
                    <span style={{ color: `${ORANGE}90` }}>Problem — </span>
                    {problem}
                  </p>
                  <p
                    className="text-sm font-light leading-loose"
                    style={{ color: "rgba(234,228,213,0.4)" }}>
                    <span style={{ color: `${ORANGE}90` }}>Solution — </span>
                    {solution}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── LEARNINGS ───────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Key Learnings</Label>
          <SectionHeading>What building this taught me.</SectionHeading>
        </Fade>
        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-8 sm:gap-10">
          {[
            {
              n: "01",
              h: "No backend doesn't mean no architecture.",
              b: "Removing the REST layer didn't remove complexity, it moved it into the client — conflict handling, optimistic updates, and cache invalidation all had to be designed deliberately instead of being someone else's problem.",
            },
            {
              n: "02",
              h: "Real-time surfaces edge cases solo testing can't.",
              b: "Two users reacting to the same image at the same instant exposed race conditions that never showed up testing alone — real concurrency is the only way to find them.",
            },
            {
              n: "03",
              h: "Constraints make the UX logic diverge.",
              b: "Capping reactions at one-per-user while leaving comments unlimited meant the two features needed different write logic, even on the exact same underlying database pattern.",
            },
            {
              n: "04",
              h: "Optimistic UI is a contract, not a trick.",
              b: "Showing the update before the server confirms it means the rollback path matters just as much as the happy path — it's a promise to the user, not a shortcut.",
            },
          ].map(({ n, h, b }) => (
            <Fade key={n}>
              <div className="flex gap-5 sm:gap-6">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase shrink-0 mt-1"
                  style={{ color: `${ORANGE}60`, fontWeight: 300 }}>
                  {n}
                </span>
                <div>
                  <p className="text-sm font-normal mb-2" style={{ color: CREAM }}>
                    {h}
                  </p>
                  <p
                    className="text-sm font-light leading-loose"
                    style={{ color: "rgba(234,228,213,0.4)" }}>
                    {b}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />
    
    </div>
  );
}