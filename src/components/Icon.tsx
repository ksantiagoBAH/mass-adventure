export function Icon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d={
          name === "home"
            ? "M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7"
            : name === "map"
              ? "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"
              : name === "stickers"
                ? "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"
                : name === "parents"
                  ? "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M18 8a3 3 0 0 1 0 6m4 7v-2a4 4 0 0 0-3-3M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
                  : name === "sound"
                    ? "m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"
                    : name === "arrow"
                      ? "M4 12h16m-6-6 6 6-6 6"
                      : name === "back"
                        ? "M20 12H4m6-6-6 6 6 6"
                        : name === "check"
                          ? "m5 12 4 4L19 6"
                          : "M12 5v14M5 12h14"
        }
      />
    </svg>
  );
}
