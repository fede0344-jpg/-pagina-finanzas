import "server-only";
import { XMLParser } from "fast-xml-parser";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  region: "ar" | "intl";
}

const FEEDS: { url: string; source: string; region: "ar" | "intl" }[] = [
  { url: "https://www.ambito.com/rss/economia.xml", source: "Ámbito", region: "ar" },
  {
    url: "https://www.infobae.com/arc/outboundfeeds/rss/category/economia/",
    source: "Infobae",
    region: "ar",
  },
  {
    url: "https://www.investing.com/rss/news_25.rss",
    source: "Investing.com",
    region: "intl",
  },
];

const parser = new XMLParser({ ignoreAttributes: true });

interface RawItem {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 900 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const rawItems = parsed?.rss?.channel?.item;
    const list: RawItem[] = Array.isArray(rawItems)
      ? rawItems
      : rawItems
        ? [rawItems]
        : [];

    return list
      .slice(0, 6)
      .map((item) => ({
        title: String(item.title ?? "").trim(),
        link: String(item.link ?? "").trim(),
        pubDate: String(item.pubDate ?? ""),
        source: feed.source,
        region: feed.region,
      }))
      .filter((item) => item.title && item.link);
  } catch {
    return [];
  }
}

export async function getEconomicNews(): Promise<NewsItem[]> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  return results.flat();
}
