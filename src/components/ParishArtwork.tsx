import { useState } from "react";
import { Illustration } from "./Illustration";
import { parishArtwork, artDescriptions } from "../data/massParts";

/** Keep a lesson usable if a local artwork file fails to load. */
export function ParishArtwork({ kind }: { kind: "church" | "altar" }) {
  const [failed, setFailed] = useState(false);
  const artwork = parishArtwork[kind];
  if (failed) {
    return (
      <Illustration
        kind={kind}
        alt={artDescriptions[kind]}
        scene={kind === "church"}
      />
    );
  }
  return (
    <img
      className={kind === "church" ? "parish-church-art" : "parish-altar-art"}
      src={artwork.src}
      alt={artwork.alt}
      width={kind === "church" ? 1536 : 1254}
      height={kind === "church" ? 1024 : 1254}
      fetchPriority={kind === "church" ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}
