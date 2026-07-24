"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { milestones } from "../../data/achievements";
import {
  homeCertificates,
  type HomeCertificate,
} from "../../data/home-certificates";

type Category = "all" | "milestone" | "certificate";

type AchievementItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "milestone" | "certificate";
  issuer?: string;
  image?: string;
  credentialUrl?: string;
};

const ITEMS_PER_PAGE = 6;

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

function mapMilestonesToItems(): AchievementItem[] {
  return milestones
    .filter((m) => m.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => ({
      id: m.id,
      title: m.title,
      description: m.detail,
      date: m.year,
      category: "milestone" as const,
    }));
}

function mapCertificatesToItems(): AchievementItem[] {
  return homeCertificates
    .filter((c) => c.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      date: dateFormatter.format(new Date(c.issueDate)),
      category: "certificate" as const,
      issuer: c.issuer,
      image: c.image,
      credentialUrl: c.credentialUrl,
    }));
}

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "milestone", label: "Milestones" },
  { value: "certificate", label: "Certificates" },
];

export function AchievementsContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const allItems = useMemo(() => {
    return [...mapMilestonesToItems(), ...mapCertificatesToItems()];
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        (item.issuer && item.issuer.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allItems, activeCategory, search]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="mx-auto w-full px-[10vw] max-md:px-[6vw]">
      {/* Toolbar: Search + Filter */}
      <section className="py-[60px] border-b border-line">
        <div className="flex flex-col gap-6 max-md:gap-5">
          {/* Search */}
          <div className="relative w-full max-w-[480px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search achievements..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className="w-full bg-transparent border border-line rounded-lg text-foreground text-sm pl-11 pr-4 py-3 outline-none transition-all duration-200 placeholder:text-muted focus:border-purple"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`border rounded-lg text-xs px-4 py-2 transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.value
                    ? "border-purple text-purple bg-[rgba(169,139,255,.08)]"
                    : "border-line text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results count */}
      <div className="pt-8 pb-2">
        <p className="text-muted text-sm">
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "achievement" : "achievements"} found
        </p>
      </div>

      {/* Card grid */}
      <section className="py-8">
        {filteredItems.length === 0 ? (
          <div className="border border-dashed border-line text-muted p-[35px] text-center">
            <p className="m-0">No achievements match your search.</p>
          </div>
        ) : (
          <div className="grid gap-[18px] grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2">
            {visibleItems.map((item, index) => (
              <AchievementCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pb-[100px] pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="border border-line rounded-lg text-foreground text-xs px-6 py-3 transition-all duration-200 cursor-pointer hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

function AchievementCard({
  item,
  index,
}: {
  item: AchievementItem;
  index: number;
}) {
  const isCertificate = item.category === "certificate";

  return (
    <article
      className={`bg-[rgba(16,14,23,.48)] border border-line rounded-[18px] flex flex-col overflow-hidden relative transition-all duration-200 hover:border-[rgba(169,139,255,.42)] hover:shadow-[0_22px_50px_rgba(0,0,0,.24)] hover:-translate-y-[5px] ${
        isCertificate ? "min-h-[360px]" : "min-h-[280px]"
      }`}
    >
      {/* Certificate image */}
      {isCertificate && item.image && (
        <div className="h-[200px] overflow-hidden relative max-md:h-[160px]">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Milestone year badge */}
      {!isCertificate && (
        <div className="px-6 pt-6 pb-0">
          <span className="border border-purple/30 text-purple rounded-md text-[11px] px-2.5 py-1 inline-block">
            {item.date}
          </span>
        </div>
      )}

      {/* Number index */}
      <span className="text-purple text-xs tracking-[.14em] px-6 py-0 relative z-10 mt-4">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="px-6 pb-4 pt-3 relative z-10 flex-1 flex flex-col">
        {/* Meta: issuer + date for certificates */}
        {isCertificate && (
          <p className="text-muted text-[10px] tracking-[.12em] mb-[14px] uppercase">
            {item.issuer} / {item.date}
          </p>
        )}

        <h3 className="text-[clamp(20px,2vw,28px)] font-medium tracking-[-.04em] leading-[1.1] mb-3 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-muted text-sm leading-[1.7] mb-0 line-clamp-2 flex-1">
          {item.description}
        </p>
      </div>

      {/* Footer */}
      <div className="items-center border-t border-line text-muted flex text-xs justify-between mt-auto py-[22px] px-6 relative z-10">
        <span>{isCertificate ? "View credential" : "View details"}</span>
        <ArrowUpRight className="text-purple" size={18} aria-hidden="true" />
      </div>
    </article>
  );
}
