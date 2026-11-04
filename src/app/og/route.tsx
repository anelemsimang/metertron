import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 120) || "Metertron";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0B3D2E 0%, #10281C 55%, #0a1f14 100%)",
          padding: "64px",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#147A45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>Metertron</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: -1.5, lineHeight: 1.1, maxWidth: 980 }}>
            {title}
          </div>
          <div style={{ fontSize: 22, color: "#A8D5C2" }}>Every meter, accounted for.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#7EB89A", fontSize: 18 }}>
          <span>metertron.co.za</span>
          <span style={{ color: "#2EC4B6" }}>Water meter installation software</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
