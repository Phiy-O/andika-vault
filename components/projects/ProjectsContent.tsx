"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { homeProjects, type HomeProject } from "../../data/home-projects";
import { Card } from "../content/Card";

type FilterOption = "all" | "featured" | "product" | "tool";

const ITEMS_PER_PAGE = 6;

const DEFAULT_PROJECT_THUMBNAIL = "/images/thumbnails/projects-thumbnail.png";

const filters: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "featured", label: "Featured" },
  { value: "product", label: "Products" },
  { value: "tool", label: "Tools" },
];

export function ProjectsContent() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const allProjects = useMemo(() => {
    return homeProjects
      .filter((p) => p.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "featured" && project.featured) ||
        (activeFilter === "product" && project.category === "product") ||
        (activeFilter === "tool" && project.category === "tool");

      const matchesSearch =
        search === "" ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(search.toLowerCase())
        );

      return matchesFilter && matchesSearch;
    });
  }, [allProjects, activeFilter, search]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

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
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className="w-full bg-transparent border border-line rounded-lg text-foreground text-sm pl-11 pr-4 py-3 outline-none transition-all duration-200 placeholder:text-muted focus:border-purple"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`border rounded-lg text-xs px-4 py-2 transition-all duration-200 cursor-pointer ${
                  activeFilter === filter.value
                    ? "border-purple text-purple bg-[rgba(169,139,255,.08)]"
                    : "border-line text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results count */}
      <div className="pt-8 pb-2">
        <p className="text-muted text-sm">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"} found
        </p>
      </div>

      {/* Card grid */}
      <section className="py-8">
        {filteredProjects.length === 0 ? (
          <div className="border border-dashed border-line text-muted p-[35px] text-center">
            <p className="m-0">No projects match your search.</p>
          </div>
        ) : (
          <div className="grid gap-[18px] grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
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

function ProjectCard({
  project,
  index,
}: {
  project: HomeProject;
  index: number;
}) {
  return (
    <Card href={`/projects/${project.slug}`} className="min-h-[360px] max-md:min-h-0">
      <div className="h-[220px] mb-6 overflow-hidden relative max-md:h-[180px]">
        <Image
          src={project.thumbnail || DEFAULT_PROJECT_THUMBNAIL}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <span className="text-purple text-xs tracking-[.14em] px-6 py-0 relative z-10">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="mt-[18px] px-6 pb-4 relative z-10 flex-1 flex flex-col">
        <h3 className="text-[clamp(22px,2vw,30px)] font-medium tracking-[-.04em] leading-[1.05] mb-3.5 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-muted text-sm leading-[1.7] mb-[18px] line-clamp-2 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-0">
          {project.techStack.map((tech) => (
            <span
              className="items-center border border-line rounded-[5px] text-muted inline-flex text-[11px] h-[28px] justify-center px-2.5 py-0"
              key={tech}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="items-center border-t border-line text-muted flex text-xs justify-between mt-auto py-[22px] px-6 relative z-10">
        <span>View project</span>
        <ArrowUpRight className="text-purple" size={18} aria-hidden="true" />
      </div>
    </Card>
  );
}
