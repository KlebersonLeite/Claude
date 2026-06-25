import {
  AbsoluteFill,
  Sequence,
  Img,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const fontFamily = "Montserrat";

loadFont({
  family: fontFamily,
  url: staticFile("fonts/Montserrat.ttf"),
});

// ---- Brand (extracted from official logo SVG) ----
const NAVY_DEEP = "#001634";
const NAVY = "#002E6C"; // brand navy
const BLUE = "#0A4AA0";
const GREEN = "#029739"; // brand green
const GREEN_LIGHT = "#36D06A"; // brighter green for accents/contrast on navy
const WHITE = "#FFFFFF";

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Smooth entrance helper (returns 0->1 over [start,start+dur])
const enter = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

// Scene wrapper that fades the whole scene in and out near its edges
const Scene: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---- Persistent animated background ----
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, ${BLUE} 130%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 18%, rgba(2,151,57,0.32), transparent 55%)`,
          translate: `0px ${interpolate(drift, [0, 1], [-30, 30])}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 80% 90%, rgba(2,151,57,0.30), transparent 50%)`,
          translate: `0px ${interpolate(drift, [0, 1], [40, -40])}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// Lightning bolt mark
const Bolt: React.FC<{ size: number; color?: string }> = ({ size, color = GREEN_LIGHT }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"
      fill={color}
      stroke={color}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </svg>
);

// ---- Official logo (SVG, white wordmark + brand green mark, transparent bg) ----
const Logo: React.FC<{ width?: number }> = ({ width = 220 }) => (
  <Img src={staticFile("logo.svg")} style={{ width, height: "auto" }} />
);

// ---- Scene 1: Hook ----
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const boltScale = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const pulse = 1 + 0.05 * Math.sin(frame / 6);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <div style={{ scale: String(boltScale * pulse) }}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: "rgba(54,208,106,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 80px rgba(54,208,106,0.45)",
          }}
        >
          <Bolt size={120} />
        </div>
      </div>
      <h1
        style={{
          fontFamily,
          fontSize: 70,
          fontWeight: 800,
          color: WHITE,
          textAlign: "center",
          lineHeight: 1.1,
          margin: 0,
          opacity: enter(frame, 14),
          translate: `0px ${interpolate(enter(frame, 14), [0, 1], [40, 0])}px`,
        }}
      >
        Precisa de
        <br />
        <span style={{ color: GREEN_LIGHT }}>dinheiro rápido?</span>
      </h1>
    </div>
  );
};

// ---- Scene 2: 1 hour ----
const SceneSpeed: React.FC = () => {
  const frame = useCurrentFrame();
  const bigScale = interpolate(frame, [10, 34], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <p
        style={{
          fontFamily,
          fontSize: 46,
          fontWeight: 600,
          color: WHITE,
          textAlign: "center",
          margin: 0,
          opacity: enter(frame, 0),
          translate: `0px ${interpolate(enter(frame, 0), [0, 1], [-30, 0])}px`,
        }}
      >
        Empréstimo com
        <br />
        liberação em até
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          scale: String(bigScale),
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 200,
            fontWeight: 800,
            color: GREEN_LIGHT,
            lineHeight: 1,
            textShadow: "0 0 50px rgba(54,208,106,0.5)",
          }}
        >
          1
        </span>
        <span
          style={{
            fontFamily,
            fontSize: 96,
            fontWeight: 800,
            color: WHITE,
          }}
        >
          HORA
        </span>
      </div>
      <div
        style={{
          marginTop: 14,
          padding: "16px 34px",
          borderRadius: 100,
          border: `2px solid ${GREEN}`,
          background: "rgba(54,208,106,0.12)",
          fontFamily,
          fontSize: 34,
          fontWeight: 700,
          color: GREEN,
          opacity: enter(frame, 40),
          scale: String(enter(frame, 40)),
        }}
      >
        100% online e sem burocracia
      </div>
    </div>
  );
};

// ---- Scene 3: Energy bill discount ----
const SceneEnergy: React.FC = () => {
  const frame = useCurrentFrame();
  const cardEnter = enter(frame, 8, 22);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <h2
        style={{
          fontFamily,
          fontSize: 50,
          fontWeight: 700,
          color: WHITE,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.2,
          opacity: enter(frame, 0),
        }}
      >
        Parcelas descontadas
        <br />
        direto na sua
      </h2>

      {/* Energy bill card */}
      <div
        style={{
          width: 460,
          borderRadius: 28,
          background: WHITE,
          padding: "34px 36px",
          boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          opacity: cardEnter,
          translate: `0px ${interpolate(cardEnter, [0, 1], [60, 0])}px`,
          rotate: `${interpolate(cardEnter, [0, 1], [-4, 0])}deg`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              background: "rgba(2,151,57,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bolt size={36} color="#E8A400" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily, fontSize: 28, fontWeight: 800, color: NAVY }}>
              Conta de Energia
            </span>
            <span style={{ fontFamily, fontSize: 20, fontWeight: 600, color: "#7A8699" }}>
              Vencimento mensal
            </span>
          </div>
        </div>
        <div style={{ height: 2, background: "#E7EBF2", marginBottom: 20 }} />
        {[
          ["Consumo", "R$ 180,00"],
          ["Parcela OnCred", "R$ 149,00"],
        ].map(([label, value], i) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              opacity: enter(frame, 30 + i * 8),
            }}
          >
            <span style={{ fontFamily, fontSize: 26, fontWeight: 600, color: "#48536B" }}>
              {label}
            </span>
            <span
              style={{
                fontFamily,
                fontSize: 28,
                fontWeight: 800,
                color: i === 1 ? GREEN : NAVY,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <p
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 600,
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
          margin: 0,
          maxWidth: 520,
          opacity: enter(frame, 52),
        }}
      >
        Sem boleto, sem dor de cabeça. Tudo na conta que você já paga.
      </p>
    </div>
  );
};

// ---- Scene 4: CTA ----
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const logoEnter = enter(frame, 4, 20);
  const btnPulse = 1 + 0.04 * Math.sin(frame / 7);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
      <div
        style={{
          scale: String(logoEnter),
          opacity: logoEnter,
        }}
      >
        <Logo width={360} />
      </div>
      <h2
        style={{
          fontFamily,
          fontSize: 52,
          fontWeight: 700,
          color: WHITE,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.2,
          opacity: enter(frame, 22),
          translate: `0px ${interpolate(enter(frame, 22), [0, 1], [30, 0])}px`,
        }}
      >
        Simule agora e receba
        <br />
        <span style={{ color: GREEN_LIGHT }}>em até 1 hora</span>
      </h2>
      <div
        style={{
          padding: "26px 60px",
          borderRadius: 100,
          background: `linear-gradient(90deg, ${GREEN}, #36D06A)`,
          fontFamily,
          fontSize: 40,
          fontWeight: 800,
          color: NAVY_DEEP,
          boxShadow: "0 16px 50px rgba(2,151,57,0.5)",
          opacity: enter(frame, 36),
          scale: String(enter(frame, 36) * btnPulse),
        }}
      >
        oncred.com.br
      </div>
      <p
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          textAlign: "center",
          opacity: enter(frame, 50),
        }}
      >
        Crédito sujeito a análise. Consulte condições.
      </p>
    </div>
  );
};

// Thin progress bar at the top
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames], [0, 100]);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start" }}>
      <div style={{ height: 8, width: "100%", background: "rgba(255,255,255,0.12)" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: GREEN_LIGHT }} />
      </div>
    </AbsoluteFill>
  );
};

export const OnCredPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY_DEEP }}>
      <Audio
        src={staticFile("music-inspiration.mp3")}
        volume={(f) =>
          interpolate(f, [0, 18, 420, 450], [0, 0.85, 0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Background />

      {/* Persistent small logo top-left after intro */}
      <Sequence from={96} name="watermark">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 40 }}>
          <Logo width={180} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={0} durationInFrames={96} name="Hook">
        <Scene durationInFrames={96}>
          <SceneHook />
        </Scene>
      </Sequence>

      <Sequence from={96} durationInFrames={114} name="Speed">
        <Scene durationInFrames={114}>
          <SceneSpeed />
        </Scene>
      </Sequence>

      <Sequence from={210} durationInFrames={120} name="Energy">
        <Scene durationInFrames={120}>
          <SceneEnergy />
        </Scene>
      </Sequence>

      <Sequence from={330} durationInFrames={120} name="CTA">
        <Scene durationInFrames={120}>
          <SceneCTA />
        </Scene>
      </Sequence>

      <ProgressBar />
    </AbsoluteFill>
  );
};
