import { useId } from "react";
import { stickerDesigns } from "../data/massParts";

/** Original vector collectibles, distinct from the lesson illustrations. */
export function StickerArtwork({ kind }: { kind: string }) {
  const id = useId();
  const design = stickerDesigns[kind] || stickerDesigns.gathering;
  const gold = `${id}-gold`, paper = `${id}-paper`, title = `${id}-title`;
  const goldFill = `url(#${gold})`;
  return <svg className="illustration sticker-artwork" viewBox="0 0 240 240" role="img" aria-labelledby={title} data-sticker-kind={kind}>
    <title id={title}>{design.alt}</title>
    <defs>
      <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff0ad" /><stop offset=".45" stopColor="#f4bf53" /><stop offset="1" stopColor="#ba7925" /></linearGradient>
      <radialGradient id={paper}><stop stopColor="#fffdf5" /><stop offset="1" stopColor={design.tint} /></radialGradient>
    </defs>
    <circle cx="120" cy="124" r="103" fill="#31473d" opacity=".09" />
    <circle cx="120" cy="119" r="103" fill="#fffdf7" />
    <circle cx="120" cy="119" r="96" fill={goldFill} />
    <circle cx="120" cy="119" r="89" fill={`url(#${paper})`} stroke="#fff8e2" strokeWidth="3" />
    <circle cx="120" cy="119" r="83" fill="none" stroke={design.ink} strokeWidth="1.5" strokeDasharray="2 7" opacity=".4" />
    <g fill={goldFill} stroke="#ba7925" strokeWidth=".7">
      <path d="m49 93 3-8 3 8 8 3-8 3-3 8-3-8-8-3z" />
      <path d="m182 63 2-6 2 6 6 2-6 2-2 6-2-6-6-2z" />
      <path d="m174 186 2-6 2 6 6 2-6 2-2 6-2-6-6-2z" />
    </g>
    {kind === "gathering" && <g strokeLinecap="round" strokeLinejoin="round">
      {/* Two adults embrace their child around a shared heart. */}
      <path d="M52 180v-48q0-31 30-31t30 31v48" fill="#7f9fc0" />
      <path d="M132 180v-48q0-31 27-31t29 31v48" fill="#e8947c" />
      <path d="M129 120V83q0-35 30-35t31 35v42l-16-9h-31z" fill="#996744" />
      <circle cx="82" cy="83" r="25" fill="#bd845f" />
      <path d="M57 82q-4-34 25-34t25 34l-9-14q-17 8-33-2z" fill="#4d3a31" />
      <ellipse cx="159" cy="83" rx="24" ry="27" fill="#f0c5a0" />
      <path d="M134 79q-2-31 25-31t26 34q-16-2-25-18-8 13-26 15" fill="#996744" />
      <path d="M138 80q-5 26-2 43m47-43q6 25 2 42" fill="none" stroke="#996744" strokeWidth="9" />
      <path d="M92 184v-29q0-26 28-26t28 26v29" fill="#85a478" />
      <circle cx="120" cy="120" r="20" fill="#dfad87" />
      <path d="M100 118q-3-26 20-26t20 26l-7-13q-12 7-26-1z" fill="#624e40" />
      <g fill="#334b42"><circle cx="74" cy="85" r="2" /><circle cx="90" cy="85" r="2" /><circle cx="151" cy="85" r="2" /><circle cx="167" cy="85" r="2" /><circle cx="114" cy="122" r="1.8" /><circle cx="126" cy="122" r="1.8" /></g>
      <g fill="none" stroke="#874e3c" strokeWidth="2"><path d="M75 95q7 6 14 0M152 95q7 6 14 0M115 130q5 4 10 0" /></g>
      <path d="M67 143q8 35 38 37m68-37q-8 35-38 37" fill="none" stroke="#e5b591" strokeWidth="13" />
      <path d="M120 190c-11-8-27-19-27-31 0-15 18-20 27-7 9-13 27-8 27 7 0 12-16 23-27 31z" fill="#d87668" stroke="#ad5147" strokeWidth="2" />
      <path d="M120 159v17m-7-9h14" stroke="#fff2ce" strokeWidth="3" />
    </g>}
    {kind === "listening" && <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M55 113q33-13 65 5 32-18 65-5v69q-34-10-65 8-31-18-65-8z" fill="#648d95" stroke="#446b74" strokeWidth="4" />
      <path d="M61 106q30-10 59 7 29-17 59-7v68q-30-9-59 9-29-18-59-9z" fill="#fffdf1" stroke="#b6a578" strokeWidth="2" />
      <path d="M120 114v68M72 132l31 4m-31 10 31 4m34-14 31-4m-31 18 31-4m-31 18 31-4" stroke="#d9c89a" strokeWidth="3" />
      <path d="M91 174v22l7-5 7 5v-18" fill="#d9786d" />
      <path d="M120 125c-16-11-33-24-33-40 0-18 22-24 33-8 11-16 33-10 33 8 0 16-17 29-33 40z" fill="#dc8378" stroke="#b9615b" strokeWidth="2" />
      <path d="m107 67-4-9m17 5V51m17 16 4-9" stroke={goldFill} strokeWidth="4" />
      <path d="M101 86q-7-9-12-1" stroke="#fbe4d3" strokeWidth="4" fill="none" />
    </g>}
    {kind === "sharing" && <g strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#e0b454" strokeWidth="2"><path d="M120 43v9m-27 0 5 8m-23 13 9 4m72-4 9-4m-23-9 5-8" /></g>
      <circle cx="120" cy="84" r="28" fill="#fffdf5" stroke="#d9bd77" strokeWidth="2.5" />
      <circle cx="120" cy="84" r="22" fill="none" stroke="#f0e4c5" strokeWidth="1.5" />
      <path d="M120 70v28m-10-17h20" stroke="#d3b16a" strokeWidth="3" />
      <path d="M91 117h58q0 37-29 37t-29-37z" fill={goldFill} stroke="#ad772d" strokeWidth="3" />
      <path d="M120 154v26m-19 7q19-14 38 0z" fill={goldFill} stroke="#ad772d" strokeWidth="4" />
      <path d="M100 125q4 15 11 18" stroke="#fff0ac" strokeWidth="4" fill="none" />
      <path d="M69 178q-1-24 9-50" fill="none" stroke="#a47e36" strokeWidth="3" />
      <g fill="#e9c066" stroke="#b18a3f" strokeWidth="1"><ellipse cx="72" cy="143" rx="4" ry="9" transform="rotate(-35 72 143)" /><ellipse cx="82" cy="139" rx="4" ry="9" transform="rotate(30 82 139)" /><ellipse cx="66" cy="158" rx="4" ry="9" transform="rotate(-35 66 158)" /><ellipse cx="78" cy="155" rx="4" ry="9" transform="rotate(30 78 155)" /></g>
      <path d="M163 132q11-15 23-9-2 14-18 17" fill="#72936b" />
      <g fill="#9684b6" stroke="#6a5c86" strokeWidth="1.5"><circle cx="165" cy="150" r="7" /><circle cx="179" cy="150" r="7" /><circle cx="159" cy="163" r="7" /><circle cx="173" cy="163" r="7" /><circle cx="166" cy="176" r="7" /></g>
    </g>}
    {kind === "going" && <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="120" cy="103" r="44" fill="#f7d985" opacity=".65" />
      <path d="M61 176q30-16 59 0 29-16 59 0" fill="none" stroke="#9db595" strokeWidth="5" />
      <path d="m79 145-23-29 37 7q-10-33 3-58l24 40q28-5 38 12l19 5-17 8q-10 38-53 33z" fill="#fffdf8" stroke="#8aa5af" strokeWidth="2.5" />
      <path d="M103 143q-6-32 14-64l12 38q15-9 26-2-11 25-38 31" fill="#eef4f4" stroke="#8aa5af" strokeWidth="2" />
      <path d="m99 157-26 14 6-25" fill="#fffdf8" stroke="#8aa5af" strokeWidth="2" />
      <circle cx="154" cy="118" r="2.2" fill="#334b42" />
      <path d="M175 130q-6 19-28 34" stroke="#638b58" strokeWidth="2.5" fill="none" />
      <path d="M166 144q-4-15 8-17 6 11-8 17m-5 6q12-4 15 6-10 7-15-6m-5 6q-12-6-15 5 10 8 15-5" fill="#86a473" />
    </g>}
    {kind === "explorer" && <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="72" cy="76" r="18" fill="#fff9e5" stroke="#ba8b3d" strokeWidth="2" />
      <path d="m72 61 6 15-6 15-6-15z" fill="#d88071" /><path d="m72 76 6 0-6 15z" fill="#7b9db8" />
      <path d="M102 93h53v81h-53z" fill="#f1d4a5" stroke="#b88b56" strokeWidth="2" />
      <path d="m94 96 34-32 35 32z" fill="#d7866e" stroke="#ae6558" strokeWidth="2" />
      <path d="M128 51v20m-7-13h14" stroke={goldFill} strokeWidth="4" />
      <path d="M118 174v-24q10-15 20 0v24" fill="#9a856f" />
      <path d="M119 114q9-12 18 0v14h-18z" fill="#7ba0b4" stroke="#fffdf6" strokeWidth="3" />
      <path d="M66 175q12 14 37 7" stroke="#b49e71" strokeWidth="2.5" strokeDasharray="3 6" fill="none" />
      <path d="m170 160 24 28" stroke="#526e78" strokeWidth="15" /><path d="m170 160 24 28" stroke="#8ba9b2" strokeWidth="8" />
      <circle cx="151" cy="139" r="32" fill="#ccebf0" fillOpacity=".65" stroke="#526e78" strokeWidth="6" />
      <circle cx="151" cy="139" r="25" fill="none" stroke="#fffdf5" strokeWidth="2" />
      <path d="M151 123v31m-11-19h22" stroke="#b47e32" strokeWidth="4" />
      <path d="M132 126q6-10 15-10" stroke="#fffdf7" strokeWidth="4" fill="none" />
    </g>}
  </svg>;
}
