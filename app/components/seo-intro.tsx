import { GAMBIA_GDP } from "@/utils/constants/constants";
import { formatMoney } from "@/utils/utils";
import { SITE_NAME } from "@/lib/seo";

export function SeoIntro() {
  return (
    <section
      aria-labelledby="game-intro-heading"
      className="mx-auto max-w-7xl px-4 pt-6"
    >
      <div className="rounded-xl border border-border/60 bg-card/50 px-4 py-5 sm:px-6">
        <h1
          id="game-intro-heading"
          className="text-xl font-bold tracking-tight sm:text-2xl"
        >
          {SITE_NAME}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Spend{" "}
          <span className="font-mono font-semibold text-foreground">
            {formatMoney(GAMBIA_GDP)}
          </span>{" "}
          — The Gambia&apos;s GDP — on anything from benachin and school fees to
          private islands and football clubs. Track your balance, explore
          spending by category, and share a receipt when you&apos;re done.
        </p>
      </div>
    </section>
  );
}