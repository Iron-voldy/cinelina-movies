export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center",
                   justifyContent: "center", minHeight: "100vh", gap: "1rem", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>🎬 CineLina</h1>
      <p style={{ color: "#aaa", textAlign: "center" }}>
        Open this page from the CineLina Telegram bot to download movies.
      </p>
    </main>
  );
}
