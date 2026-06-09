import type { Metadata } from "next";
import styles from "./page.module.css";

interface LinkEntry {
  q: string;   // quality label e.g. "1080p"
  s: string;   // size e.g. "2.5 GB"
  u: string;   // url
  t: string;   // type: "direct" | "magnet" | "torrent"
}

interface MovieData {
  n: string;           // name
  y?: number;          // year
  g?: string[];        // genres
  p?: string;          // poster url
  l: LinkEntry[];      // download links
}

function decodeMovieData(encoded: string): MovieData | null {
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(json) as MovieData;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}): Promise<Metadata> {
  const { d } = await searchParams;
  if (!d) return { title: "CineLina" };
  const movie = decodeMovieData(d);
  if (!movie) return { title: "CineLina" };
  return {
    title: `${movie.n}${movie.y ? ` (${movie.y})` : ""} — CineLina`,
    description: `Download ${movie.n} — ${movie.g?.join(", ") ?? ""}`,
  };
}

export default async function MoviePage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;

  if (!d) {
    return <ErrorState message="No movie data provided. Open this link from the CineLina bot." />;
  }

  const movie = decodeMovieData(d);
  if (!movie || !movie.l?.length) {
    return <ErrorState message="Invalid or expired link. Request the movie again in the bot." />;
  }

  const title = `${movie.n}${movie.y ? ` (${movie.y})` : ""}`;
  const genres = movie.g?.filter(Boolean).join(" · ") ?? "";

  // Separate direct downloads from torrents/magnets
  const directLinks = movie.l.filter((l) => l.t === "direct");
  const torrentLinks = movie.l.filter((l) => l.t === "magnet" || l.t === "torrent");

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logo}>🎬 CineLina</span>
        </div>

        {/* Movie info */}
        <div className={styles.movieInfo}>
          {movie.p && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={movie.p} alt={movie.n} className={styles.poster} />
          )}
          <div className={styles.meta}>
            <h1 className={styles.title}>{title}</h1>
            {genres && <p className={styles.genres}>{genres}</p>}
          </div>
        </div>

        {/* Direct download section */}
        {directLinks.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>⬇️ Direct Download</h2>
            <div className={styles.buttons}>
              {directLinks.map((lnk, i) => (
                <a
                  key={i}
                  href={lnk.u}
                  className={styles.btnDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.btnQuality}>{lnk.q || `Option ${i + 1}`}</span>
                  {lnk.s && <span className={styles.btnSize}>{lnk.s}</span>}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Torrent section */}
        {torrentLinks.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🧲 Torrent Download</h2>
            <p className={styles.torrentNote}>Requires a torrent client (qBittorrent, etc.)</p>
            <div className={styles.buttons}>
              {torrentLinks.map((lnk, i) => (
                <a
                  key={i}
                  href={lnk.u}
                  className={styles.btnTorrent}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.btnQuality}>{lnk.q || `Option ${i + 1}`}</span>
                  {lnk.s && <span className={styles.btnSize}>{lnk.s}</span>}
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className={styles.footer}>
          Powered by <strong>CineLina</strong> · Use CineLina bot on Telegram
        </footer>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center",
                   minHeight: "100vh", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <p style={{ fontSize: "3rem" }}>⚠️</p>
        <p style={{ color: "#aaa", marginTop: "1rem" }}>{message}</p>
      </div>
    </main>
  );
}
