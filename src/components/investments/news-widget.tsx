import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NewsItem } from "@/lib/market-data/news";

function timeAgo(pubDate: string): string | null {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return null;

  const diffHours = Math.round((Date.now() - date.getTime()) / 3_600_000);
  if (diffHours < 1) return "hace instantes";
  if (diffHours < 24) return `hace ${diffHours}h`;
  return `hace ${Math.round(diffHours / 24)}d`;
}

function NewsColumn({ title, items }: { title: string; items: NewsItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sin noticias por ahora.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.link}>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-medium leading-snug hover:underline"
              >
                {item.title}
              </a>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.source}
                {timeAgo(item.pubDate) ? ` · ${timeAgo(item.pubDate)}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NewsWidget({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  const ar = items.filter((item) => item.region === "ar").slice(0, 6);
  const intl = items.filter((item) => item.region === "intl").slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Noticias de economía</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <NewsColumn title="Argentina" items={ar} />
        <NewsColumn title="Internacional" items={intl} />
      </CardContent>
    </Card>
  );
}
