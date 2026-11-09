import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const requestedTitle = new URL(request.url).searchParams.get("title");
  const title = requestedTitle?.trim().slice(0, 100) || "PratikHesap";

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f8fc 0%, #eaf2ff 100%)",
        color: "#142b4a",
        display: "flex",
        height: "100%",
        padding: "72px",
        width: "100%"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 34, width: "100%" }}>
        <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
          <div style={{ alignItems: "center", background: "#142b4a", borderRadius: 16, display: "flex", height: 64, justifyContent: "center", width: 64 }}>
            <div style={{ background: "#fff", borderRadius: 7, display: "flex", flexDirection: "column", gap: 5, height: 44, padding: "6px", width: 36 }}>
              <div style={{ background: "#eaf2ff", borderRadius: 2, height: 9, width: 24 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 1 }}>
                {[0, 1].map((row) => (
                  <div key={row} style={{ display: "flex", gap: 2 }}>
                    {[0, 1, 2].map((column) => <div key={column} style={{ background: "#2878e5", borderRadius: 2, height: 7, width: 7 }} />)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span style={{ fontSize: 32, fontWeight: 700 }}>PratikHesap</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ color: "#2878e5", fontSize: 24, fontWeight: 600 }}>Hesaplamak artık çok kolay.</span>
          <span style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.15 }}>{title}</span>
        </div>
        <span style={{ color: "#475569", fontSize: 24 }}>Finans · Tarih · Eğitim · Günlük Yaşam</span>
      </div>
    </div>,
    { height: 630, width: 1200 }
  );
}
