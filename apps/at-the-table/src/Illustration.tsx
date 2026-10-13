import { useId } from "react";
export type Art = "church" | "cross" | "hands" | "music" | "bible" | "scroll" | "dove" | "altar" | "chalice" | "host" | "heart" | "lamb" | "sun";
export function Illustration({
  kind,
  alt,
  scene = false,
  variant = 0,
}: {
  kind: Art;
  alt: string;
  scene?: boolean;
  variant?: number;
}) {
  const id = useId();
  const cross = (
    <path
      d="M115 55h30v40h37v29h-37v72h-30v-72H78V95h37z"
      fill="#d99837"
      stroke="#956629"
      strokeWidth="4"
    />
  );
  const book = (
    <>
      <path
        d="M43 78q42-20 87 5 45-25 87-5v105q-43-13-87 10-44-23-87-10z"
        fill="#fff8e4"
        stroke="#426a64"
        strokeWidth="6"
      />
      <path d="M130 84v108" stroke="#426a64" strokeWidth="5" />
      <path
        d="M60 103l47 6m-47 15 47 6m-47 15 47 6m45-42 47-6m-47 27 47-6m-47 27 47-6"
        stroke="#d2bc90"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g className="book-turning-leaf">
        <path d="M130 84q45-25 87-6v105q-43-13-87 10z" fill="#fff8e4" stroke="#426a64" strokeWidth="3" />
        <path d="m150 103 47-6m-47 27 47-6m-47 27 47-6" stroke="#d2bc90" strokeWidth="5" strokeLinecap="round" />
      </g>
    </>
  );
  const cup = (
    <>
      <path
        d="M106 78h92q-1 64-46 64-45 0-46-64z"
        fill="#f1bb4c"
        stroke="#a27430"
        strokeWidth="5"
      />
      <path
        d="M152 143v42m-29 7h58"
        stroke="#a27430"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <ellipse
        cx="74"
        cy="163"
        rx="39"
        ry="24"
        fill="#e0a960"
        stroke="#b67a39"
        strokeWidth="4"
      />
      <path
        d="m55 150 8 12m8-17 8 12m8-17 8 12"
        stroke="#fff2d6"
        strokeWidth="5"
      />
    </>
  );
  const hands = (
    <>
      <path
        d="M128 69q-8-20-16-2l-20 54-30 27 32 44 33-29z"
        fill="#efb58e"
        stroke="#b97657"
        strokeWidth="4"
      />
      <path
        d="M132 69q8-20 16-2l20 54 30 27-32 44-33-29z"
        fill="#f5c6a5"
        stroke="#b97657"
        strokeWidth="4"
      />
      <path
        d="m81 166 27 27-13 18-35-36zm98 0-27 27 13 18 35-36z"
        fill="#7b9ab8"
      />
    </>
  );
  const dove = (
    <>
      <path
        d="M88 139Q34 128 52 76l58 35Q96 57 117 48q32 38 42 69 33-31 55-7l-25 10q-18 60-69 54l-31 28 5-38-37-6z"
        fill="#fffdf6"
        stroke="#83a39b"
        strokeWidth="4"
      />
      <circle cx="184" cy="116" r="3" fill="#37534c" />
      <path
        d="m205 121 16 16m-9-8 12-7m-12 7-4 11"
        stroke="#6f934e"
        strokeWidth="4"
      />
    </>
  );
  const church = (
    <>
      <path d="M65 125h132v99H65z" fill="#f9d395" />
      <path
        d="m53 126 78-61 79 61"
        fill="#df826b"
        stroke="#a5584a"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M112 72V31h38v41" fill="#ffe6ae" />
      <path d="m103 32 28-29 28 29" fill="#d87c68" />
      <path d="M131 1v-20m-9 9h18" stroke="#9e6b35" strokeWidth="5" />
      <path d="M108 224v-48a23 23 0 0 1 46 0v48" fill="#a97d57" />
      <path
        d="M81 174v-21a9 9 0 0 1 18 0v21zm82 0v-21a9 9 0 0 1 18 0v21z"
        fill="#8ebbc6"
        stroke="#fff6d7"
        strokeWidth="5"
      />
      <circle
        cx="131"
        cy="118"
        r="15"
        fill="#8ebbc6"
        stroke="#fff6d7"
        strokeWidth="5"
      />
      <path d="M131 105v26m-13-13h26" stroke="#fff6d7" strokeWidth="4" />
      <circle cx="141" cy="201" r="3" fill="#f8d489" />
    </>
  );
  return (
    <svg
      className={scene ? "scene" : "illustration"}
      viewBox={scene ? "0 0 620 450" : "0 0 260 240"}
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>{alt}</title>
      {scene ? (
        <>
          <path
            d="M15 390V165Q13 15 205 29q77-56 146 0 139-29 212 80 60 60 35 217v64z"
            fill="#dff0ed"
          />
          <circle cx="477" cy="104" r="41" fill="#f6c65d" />
          <g stroke="#e4b753" strokeWidth="3" strokeLinecap="round">
            <path d="M477 46v-12m0 140v-12m-58-58h-12m140 0h-12m-97-41-9-9m100 100-9-9m0-82 9-9m-100 100 9-9" />
          </g>
          <path
            d="M57 121q0-14 17-14 9-25 31-8 23-7 29 17zM355 81q5-19 23-15 21-27 35 0 23-3 26 15z"
            fill="#fffdf4"
          />
          <path
            d="M20 302q130-90 294 17 170-90 285-40v111H20z"
            fill="#b7d19d"
          />
          <path d="M20 350q169-95 329-3 140-25 250-26v69H20z" fill="#99bb82" />
          <path
            d="M290 290q-31 46 34 68t-67 85h130q140-68 38-89t-72-64"
            fill="#f4e6bd"
          />
          <g transform="translate(128 37) scale(1.15)">{church}</g>
          <g fill="#729a72">
            <ellipse cx="89" cy="245" rx="34" ry="55" />
            <ellipse cx="510" cy="238" rx="37" ry="60" />
          </g>
          <g stroke="#5d7955" strokeWidth="7">
            <path d="M89 255v70m421-78v71" />
          </g>
          <g fill="#fff9de">
            <path d="m50 338 4-9 5 9 10 2-8 6 1 11-8-6-9 6 2-11-8-6zm502 29 4-9 5 9 10 2-8 6 1 11-8-6-9 6 2-11-8-6z" />
          </g>
          <g fill="#ec947b">
            <circle cx="146" cy="353" r="5" />
            <circle cx="463" cy="332" r="5" />
            <circle cx="476" cy="372" r="4" />
          </g>
          <g stroke="#628453" strokeWidth="2">
            <path d="M146 358v13m317-34v11m13 28v10" />
          </g>
        </>
      ) : (
        <>
          <circle
            cx="130"
            cy="123"
            r="101"
            fill={["#edf3df", "#e5eff5", "#fce8df", "#eee5f6"][variant % 4]}
          />
          <g stroke="#d5aa49" strokeWidth="3" strokeLinecap="round">
            <path d="M33 63v14m-7-7h14m178 97v14m-7-7h14" />
          </g>
          {kind === "church" ? (
            <g transform="translate(0 10) scale(.92)">{church}</g>
          ) : kind === "cross" ? (
            cross
          ) : kind === "bible" ? (
            book
          ) : kind === "scroll" ? (
            <>
              <path
                d="M68 54h132l-10 131H67z"
                fill="#fff6d6"
                stroke="#bfa16a"
                strokeWidth="5"
              />
              <path
                d="M67 54q-28 0-21 28h143q-5-27 11-28m-132 131q-12 22 12 24h117q21-8-7-24"
                fill="#e8d09d"
                stroke="#bfa16a"
                strokeWidth="5"
              />
              <path
                d="M88 108h79m-79 20h67m-67 20h72"
                className="scripture-lines"
                stroke="#a88d63"
                strokeWidth="5"
              />
            </>
          ) : kind === "hands" ? (
            hands
          ) : kind === "dove" ? (
            dove
          ) : kind === "chalice" ? (
            cup
          ) : kind === "host" ? (
            <>
              <path
                d="M106 78h92q-1 64-46 64-45 0-46-64z"
                fill="#f1bb4c"
                stroke="#a27430"
                strokeWidth="5"
              />
              <path
                d="M152 143v42m-29 7h58"
                stroke="#a27430"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <circle
                cx="83"
                cy="78"
                r="33"
                fill="#fffdf4"
                stroke="#d2b77a"
                strokeWidth="3"
              />
              <path d="M83 59v38M69 74h28" stroke="#d2b77a" strokeWidth="4" />
            </>
          ) : kind === "altar" ? (
            <>
              <path d="M47 124h167v65H47z" fill="#d4a06b" />
              <path
                d="M38 112h185v29l-25-9-22 9-24-9-22 9-24-9-22 9-24-9-22 9z"
                fill="#fffdf6"
                stroke="#a8a185"
                strokeWidth="3"
              />
              <path
                d="M66 69h12v43H66zm113 0h12v43h-12z"
                fill="#fff2ce"
                stroke="#c5ab75"
                strokeWidth="3"
              />
              <path
                d="M72 66q-13-9 0-25 13 16 0 25m113 0q-13-9 0-25 13 16 0 25"
                className="altar-flames"
                fill="#edb547"
              />
              <path d="M117 93q13-18 27 0v19h-27z" fill="#e4b765" />
            </>
          ) : kind === "music" ? (
            <g className="singing-notes">
              <path
                d="M95 143V68l90-16v80"
                fill="none"
                stroke="#658c82"
                strokeWidth="10"
                strokeLinejoin="round"
              />
              <ellipse
                cx="79"
                cy="145"
                rx="22"
                ry="16"
                transform="rotate(-18 79 145)"
                fill="#658c82"
              />
              <ellipse
                cx="169"
                cy="134"
                rx="22"
                ry="16"
                transform="rotate(-18 169 134)"
                fill="#658c82"
              />
              <path
                d="m130 175 8-16 8 16 18 3-13 13 3 18-16-8-16 8 3-18-13-13z"
                fill="#e9b44f"
              />
            </g>
          ) : kind === "heart" ? (
            <path
              d="M130 191C15 125 67 43 130 90c63-47 115 35 0 101z"
              fill="#df8d7b"
              stroke="#b56b5e"
              strokeWidth="4"
            />
          ) : kind === "lamb" ? (
            <>
              <path
                d="M63 147v41m32-36v36m66-41v41m23-44v44"
                stroke="#9a876b"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M50 115q-6-26 18-25 4-26 30-18 15-23 36-5 27-17 43 5 27-3 24 24 28 13 9 34 9 27-19 29-22 21-43 3-30 16-46-3-36 3-29-25-26-4-23-19z"
                fill="#fffdf3"
                stroke="#c2b897"
                strokeWidth="4"
              />
              <ellipse cx="190" cy="110" rx="20" ry="29" fill="#a68c72" />
              <circle cx="195" cy="106" r="3" fill="#fff" />
            </>
          ) : (
            <>
              <circle cx="130" cy="122" r="49" fill="#f0be56" />
              <g className="sun-rays" stroke="#d6a242" strokeWidth="7" strokeLinecap="round">
                <path d="M130 46V30m0 184v-16M54 122H38m184 0h-16M77 69 65 57m130 130-12-12m0-106 12-12M65 187l12-12" />
              </g>
            </>
          )}
        </>
      )}
    </svg>
  );
}
