import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../components/PageTransition";

// ─────────────────────────────────────────────────────────────────────────
// ASSETS — swap these with your real Meal Manager files.
// Keep the folder/name pattern below, or update the paths to match yours.
// ─────────────────────────────────────────────────────────────────────────
import mealManagerVideo from "../assets/videos/MealManager_Main.mp4";
import mealManagerHome from "../assets/mealManagerImages/meal_manager_home.jpg";
import ownerDashboard from "../assets/mealManagerImages/owner_dashboard.jpg";
import customerDashboard from "../assets/mealManagerImages/customer_dashboard.jpg";
import menuManagement from "../assets/mealManagerImages/menu_management.jpg";
import orderDuesTracking from "../assets/mealManagerImages/order_dues_tracking.jpg";
import browseMeals from "../assets/mealManagerImages/order_dues_tracking.jpg";
import duesHistory from "../assets/mealManagerImages/order_dues_tracking.jpg";
// Cover image for whichever case study comes after this one in your portfolio
import nextProjectCover from "../assets/mealManagerImages/order_dues_tracking.jpg";

const CREAM = "#EAE4D5";
const ORANGE = "#E8400C";
const E = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────────────────
// Shared helpers — same pattern as the Elevate case study page.
// If you end up building a third case study, it's worth pulling these
// into a shared "caseStudy" components file instead of duplicating again.
// ─────────────────────────────────────────────────────────────────────────
function useFade(margin = "-60px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
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

function Body({ children }) {
  return (
    <p
      className="leading-loose max-w-[56ch]"
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

function ScreenImg({ src, alt }) {
  return (
    <div
      className="w-full rounded-sm overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "#0e0e0e",
      }}>
      <img src={src} alt={alt} className="w-full h-full object-cover block" />
    </div>
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

// Scroll-driven hero video — takes the source as a prop since this page
// only has the one video, instead of importing it directly.
function HeroVideo({ src }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.75], [0.78, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.75], [14, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: "180vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
        }}>
        <motion.div
          style={{
            scale,
            borderRadius: radius,
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            willChange: "transform",
          }}>
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
          />
        </motion.div>

        <motion.div
          style={{
            opacity: scrollHintOpacity,
            position: "absolute",
            bottom: "1.75rem",
            left: "50%",
            x: "-50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            pointerEvents: "none",
            zIndex: 10,
          }}>
          <span
            style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: `${CREAM}55`,
              fontWeight: 300,
            }}>
            Scroll
          </span>
          <motion.svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <path
              d="M1 1L5 5L9 1"
              stroke={`${CREAM}45`}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}

// Mobile fallback for the hero video — a static cover image instead,
// same as the Elevate page does for small screens.
function MobileHeroCover({ src, alt }) {
  return (
    <Fade>
      <div
        className="mx-6 mt-2 mb-4 rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <img src={src} alt={alt} className="w-full block" />
      </div>
    </Fade>
  );
}

// Simple feature row — image only, no hover-video swap, since this
// project only has one video and it's already used in the hero.
function FeatureRow({ label, heading, body, img, alt, imgFirst = false, caption }) {
  return (
    <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Fade className={imgFirst ? "lg:order-2" : ""}>
          <Label>{label}</Label>
          <SectionHeading>{heading}</SectionHeading>
          <Body>{body}</Body>
        </Fade>

        <Fade
          delay={0.1}
          className={`flex flex-col gap-2 ${imgFirst ? "lg:order-1" : ""}`}>
          <ScreenImg src={img} alt={alt} />
          {caption && (
            <p
              className="text-[9px] tracking-[0.2em] uppercase opacity-20"
              style={{ fontFamily: "'Geist', sans-serif" }}>
              {caption}
            </p>
          )}
        </Fade>
      </div>
    </section>
  );
}

export default function MealManager() {
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();
  const isMobile = useIsMobile();

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
          Meal Manager / Case Study
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
            SaaS · Mess Management
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
              Meal Manager
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: E, delay: 0.3 }}
            className="text-base sm:text-xl font-light leading-relaxed max-w-[48ch] mb-10 sm:mb-14"
            style={{ color: "rgba(234,228,213,0.5)" }}>
            Digitizing tiffin and mess operations for everyday businesses.
            Owners manage menus, orders, dues, and reports in one place —
            customers track their meals and balances without a single phone
            call.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.4 }}
            className="flex items-center gap-3">
            {/* Primary — Live URL. Replace with your deployed link. */}
            <a
              href="https://meal-manager-steel.vercel.app/"
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
              href="https://github.com/YamrajOfCodes/Meal-Manager"
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
        </div>
      </section>

      <Rule />

      {/* VIDEO — desktop scroll-driven / mobile static image */}
      {isMobile ? (
        <MobileHeroCover src={mealManagerHome} alt="Meal Manager home screen" />
      ) : (
        <HeroVideo src={mealManagerVideo} />
      )}

      <Rule />

      {/* Hero screenshots — owner vs customer side */}
      <section className="px-6 sm:px-10 lg:px-20 mb-4 mt-4">
        <Fade>
          <div className="mb-8 sm:mb-10">
            <Label>The Product</Label>
            <SectionHeading>Built for both sides of the table.</SectionHeading>
            <Body>
              Owners get a single dashboard to run menus, orders, dues, and
              reports — no more paper registers. Customers get their own
              dashboard to check the menu, place or skip orders, and track
              exactly what they owe.
            </Body>
          </div>
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Fade delay={0.05}>
            <div className="flex flex-col gap-2">
              <ScreenImg src={ownerDashboard} alt="Owner dashboard" />
              <p
                className="text-[9px] tracking-[0.2em] uppercase opacity-20"
                style={{ fontFamily: "'Geist', sans-serif" }}>
                Owner dashboard
              </p>
            </div>
          </Fade>
          <Fade delay={0.1}>
            <div className="flex flex-col gap-2">
              <ScreenImg src={customerDashboard} alt="Customer dashboard" />
              <p
                className="text-[9px] tracking-[0.2em] uppercase opacity-20"
                style={{ fontFamily: "'Geist', sans-serif" }}>
                Customer dashboard
              </p>
            </div>
          </Fade>
        </div>
      </section>

      <Rule />

      {/* ── FEATURE 1: Menu management ── */}
      <FeatureRow
        label="Owner Experience · 01"
        heading="Menu management without the back-and-forth."
        body="Owners update the day's menu, mark items unavailable, and adjust prices in seconds. What used to be a phone call or a note on a whiteboard is now a two-minute update that every customer sees instantly."
        img={menuManagement}
        alt="Menu management screen"
        caption="Daily menu management"
      />

      <Rule />

      {/* ── FEATURE 2: Orders & dues tracking ── */}
      <FeatureRow
        label="Owner Experience · 02"
        heading="Every order and every rupee owed, in one table."
        body="Daily orders roll up automatically against each customer's running balance. Owners see exactly who's ordered, who's skipped, and who owes what — and can generate a report or mark a payment without digging through a paper register at month-end."
        img={orderDuesTracking}
        alt="Order and dues tracking screen"
        imgFirst
        caption="Orders & dues tracking"
      />

      <Rule />

      {/* ── FEATURE 3: Browse & order meals ── */}
      <FeatureRow
        label="Customer Experience · 01"
        heading="Order today's meal, or skip it — your call."
        body="Customers check the day's menu and place an order, or mark a day off when they're travelling or just not eating in. No phone calls, no waiting for someone to write it down by hand."
        img={browseMeals}
        alt="Browse meals and place order screen"
        caption="Browse & order flow"
      />

      <Rule />

      {/* ── FEATURE 4: Dues & payment history ── */}
      <FeatureRow
        label="Customer Experience · 02"
        heading="A running tab you can actually see."
        body="Every customer gets a personal dashboard showing pending dues, payment history, and past orders — replacing the mental math everyone used to do trying to remember what they paid last."
        img={duesHistory}
        alt="Dues and payment history screen"
        imgFirst
        caption="Dues & payment history"
      />

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
              h: "Build for the person, not the persona.",
              b: "This started from watching an actual mess owner manage orders on paper. Every screen had to make sense to someone who'd never used a dashboard before — not an imagined 'SaaS power user'.",
            },
            {
              n: "02",
              h: "The ledger is the real product.",
              b: "The menu and ordering flow get used daily, but the dues tracker is what actually convinced the owner to switch from paper. Accurate money tracking mattered more than UI polish.",
            },
            {
              n: "03",
              h: "Skipping is harder to design than ordering.",
              b: "Letting customers mark a day off turned out to be one of the most-used features — tracking absence cleanly was a harder problem than tracking a normal order.",
            },
            {
              n: "04",
              h: "Real usage finds real bugs.",
              b: "Shipping to one working mess surfaced edge cases — late skips, partial payments, midnight orders — that no amount of local testing on my own would have caught.",
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
                  <p
                    className="text-sm font-normal mb-2"
                    style={{ color: CREAM }}>
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

      {/* ── NEXT PROJECT ────────────────────────────────────────────────────
         Update the route, title, and cover image below to point at whichever
         case study should follow Meal Manager in your portfolio.
      ───────────────────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 pb-24 sm:pb-32">
        <Fade>
          <p
            className="text-[9px] tracking-[0.3em] uppercase mb-6 sm:mb-8"
            style={{ color: "rgba(255,255,255,0.18)" }}>
            Next Project
          </p>
        </Fade>
        <Fade delay={0.08}>
          <button
            onClick={() => navigateWithTransition("/next-project-route")}
            className="group w-full text-left">
            <div
              className="relative overflow-hidden rounded-sm transition-all duration-700"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "21/9" }}>
                <img
                  src={nextProjectCover}
                  alt="Next project cover image"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(13,13,13,0.6) 80%, #0d0d0d 100%)",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, #0d0d0d 0%, transparent 15%, transparent 85%, #0d0d0d 100%)",
                  }}
                />
              </div>

              <div className="px-6 sm:px-10 pb-6 sm:pb-10 pt-4 flex items-end justify-between">
                <div>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase mb-2 sm:mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    {/* Replace with the next project's category */}
                    Next Case Study
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 5vw, 4rem)",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: CREAM,
                    }}>
                    {/* Replace with the next project's name */}
                    Next Project
                  </h3>
                </div>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-1"
                  style={{ color: ORANGE }}>
                  View Case Study →
                </span>
              </div>
            </div>
          </button>
        </Fade>
      </section>
    </div>
  );
}