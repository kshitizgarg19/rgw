import { ImageResponse } from "next/og";

export const alt = "RGW Sweets — Traditional Mithai Since 1950";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2c0a11 0%, #5a1322 60%, #2c0a11 100%)",
          color: "#f6ecda",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: 26,
            background: "#7c2034",
            border: "3px solid #e6c772",
            color: "#f6e0a0",
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          RGW
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, marginTop: 36, color: "#fbeec2" }}>
          RGW Sweets
        </div>
        <div style={{ display: "flex", width: 220, height: 2, background: "#c8a24a", margin: "26px 0" }} />
        <div style={{ display: "flex", fontSize: 34, color: "#ecca7a", letterSpacing: 6 }}>
          TRADITIONAL MITHAI · SINCE 1950
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#f6ecda", opacity: 0.8, marginTop: 22 }}>
          Premium Mawa Barfi & Ghiya Barfi · Delivered fresh across Delhi NCR
        </div>
      </div>
    ),
    { ...size }
  );
}
