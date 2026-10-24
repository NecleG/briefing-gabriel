import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: {
  colors: { ink: "#0B0B0B", graphite: "#1F1F1F", bronze: "#C9B89B", cream: "#EDE7D9", warm: "#A9A196" },
  fontFamily: { serif: ["var(--f-serif)", "Georgia", "serif"], sans: ["var(--f-sans)", "system-ui", "sans-serif"] } } }, plugins: [] } satisfies Config;
