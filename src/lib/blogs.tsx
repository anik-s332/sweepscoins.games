import React from "react";

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/$/, "");

const isObject = (value: unknown) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const asArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
};

const pickFirstString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getMediaUrl = (value: unknown): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    return STRAPI_URL ? `${STRAPI_URL}${value.startsWith("/") ? value : `/${value}`}` : value;
  }

  if (!isObject(value)) {
    return "";
  }

  return getMediaUrl(
    (value as Record<string, unknown>).url ||
      (value as Record<string, unknown>).src ||
      (value as Record<string, unknown>).formats ||
      (value as Record<string, unknown>).data ||
      "",
  );
};

const getFormatsUrl = (formats: unknown) => {
  if (!isObject(formats)) {
    return "";
  }

  const formatRecord = formats as Record<string, unknown>;
  return (
    getMediaUrl(formatRecord.large) ||
    getMediaUrl(formatRecord.medium) ||
    getMediaUrl(formatRecord.small) ||
    getMediaUrl(formatRecord.thumbnail) ||
    ""
  );
};

const getImageFromEntry = (entry: Record<string, unknown>) =>
  getMediaUrl(entry.coverImage) ||
  getMediaUrl(entry.cover_image) ||
  getMediaUrl(entry.image) ||
  getMediaUrl(entry.thumbnail) ||
  getMediaUrl((entry.heroImage as Record<string, unknown>)?.data) ||
  getMediaUrl((entry.coverImage as Record<string, unknown>)?.data) ||
  getFormatsUrl((entry.coverImage as Record<string, unknown>)?.formats) ||
  getFormatsUrl((entry.image as Record<string, unknown>)?.formats) ||
  "";

const getCategoryNames = (entry: Record<string, unknown>) => {
  const rawCategories =
    entry.categories ||
    entry.category ||
    (entry.attributes as Record<string, unknown>)?.categories ||
    (entry.attributes as Record<string, unknown>)?.category;

  return asArray(rawCategories)
    .flatMap((item) => {
      if (typeof item === "string") {
        return [item];
      }

      if (!isObject(item)) {
        return [];
      }

      const record = item as Record<string, unknown>;
      const nestedAttributes = isObject(record.attributes) ? (record.attributes as Record<string, unknown>) : {};
      const label = pickFirstString(
        record.name,
        record.title,
        record.label,
        nestedAttributes.name,
        nestedAttributes.title,
        nestedAttributes.label,
      );

      return label ? [label] : [];
    })
    .filter(Boolean);
};

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getBlocksText = (blocks: unknown): string => {
  if (!Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (!isObject(block)) {
        return "";
      }

      const children = asArray((block as Record<string, unknown>).children);
      return children
        .map((child) => (isObject(child) ? pickFirstString((child as Record<string, unknown>).text) : ""))
        .join(" ");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};

const getContentSource = (entry: Record<string, unknown>) =>
  entry.content ||
  entry.body ||
  entry.description ||
  entry.excerpt ||
  entry.blocks ||
  entry.article ||
  "";

export type BlogListItem = {
  id: number | string;
  documentId: string;
  title: string;
  excerpt: string;
  category: string;
  categories: string[];
  publishedAt: string;
  image: string;
};

export type BlogDetailItem = BlogListItem & {
  content: unknown;
  popularArticles: BlogListItem[];
  relatedBlogs: BlogListItem[];
  tableOfContents: Array<{
    id: string | number;
    title: string;
    anchorId: string;
    level: number | string;
  }>;
};

export const normalizeBlogListItem = (rawItem: unknown): BlogListItem | null => {
  if (!isObject(rawItem)) {
    return null;
  }

  const item = rawItem as Record<string, unknown>;
  const attributes = isObject(item.attributes) ? (item.attributes as Record<string, unknown>) : {};
  const merged = { ...attributes, ...item };
  const categories = getCategoryNames(merged);
  const contentSource = getContentSource(merged);
  const excerptSource =
    pickFirstString(
      merged.excerpt,
      merged.shortDescription,
      merged.short_description,
      merged.summary,
      merged.description,
    ) ||
    (typeof contentSource === "string" ? stripHtml(contentSource) : getBlocksText(contentSource));

  const title = pickFirstString(merged.title, merged.name, merged.heading, "Untitled Blog");
  const documentId = pickFirstString(merged.documentId, merged.slug, slugify(title));

  return {
    id: (merged.id as number | string) || documentId,
    documentId,
    title,
    excerpt: excerptSource.slice(0, 180),
    category: categories[0] || pickFirstString(merged.categoryName, merged.type, "Business"),
    categories,
    publishedAt: pickFirstString(
      merged.publishedAt,
      merged.publishDate,
      merged.published_at,
      merged.createdAt,
      merged.updatedAt,
    ),
    image: getImageFromEntry(merged),
  };
};

export const normalizeBlogDetailItem = (rawItem: unknown): BlogDetailItem | null => {
  const base = normalizeBlogListItem(rawItem);

  if (!base || !isObject(rawItem)) {
    return null;
  }

  const item = rawItem as Record<string, unknown>;
  const attributes = isObject(item.attributes) ? (item.attributes as Record<string, unknown>) : {};
  const merged = { ...attributes, ...item };

  return {
    ...base,
    content: getContentSource(merged),
    popularArticles: asArray(merged.popularArticles).map(normalizeBlogListItem).filter(Boolean) as BlogListItem[],
    relatedBlogs: asArray(merged.relatedBlogs).map(normalizeBlogListItem).filter(Boolean) as BlogListItem[],
    tableOfContents: asArray(merged.tableOfContents)
      .map((item) => {
        if (!isObject(item)) {
          return null;
        }

        const record = item as Record<string, unknown>;

        return {
          id: (record.id as string | number) || pickFirstString(record.anchorId, record.title),
          title: pickFirstString(record.title),
          anchorId: pickFirstString(record.anchorId, slugify(pickFirstString(record.title))),
          level: pickFirstString(record.level) || 2,
        };
      })
      .filter(Boolean) as BlogDetailItem["tableOfContents"],
  };
};

export const formatBlogDate = (value: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const fetchBlogs = async () => {
  if (!STRAPI_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not configured.");
  }

  const response = await fetch("/api/blogs");

  if (!response.ok) {
    throw new Error(`Unable to load blogs. Strapi responded with ${response.status}.`);
  }

  const result = await response.json();
  return asArray(result?.data).map(normalizeBlogListItem).filter(Boolean) as BlogListItem[];
};

export const fetchBlogDetail = async (documentId: string) => {
  if (!STRAPI_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not configured.");
  }

  const response = await fetch(`/api/blogs/${documentId}`);

  if (!response.ok) {
    throw new Error(`Unable to load blog details. Strapi responded with ${response.status}.`);
  }

  const result = await response.json();
  return normalizeBlogDetailItem(result?.data);
};

type RichNode = {
  id: string;
  level: number;
  title: string;
};

const getChildrenText = (children: unknown) =>
  asArray(children)
    .map((child) => (isObject(child) ? pickFirstString((child as Record<string, unknown>).text) : ""))
    .join("")
    .trim();

export const getRichTextHeadingNodes = (content: unknown): RichNode[] => {
  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map((block, index) => {
      if (!isObject(block)) {
        return null;
      }

      const record = block as Record<string, unknown>;
      const type = pickFirstString(record.type, record.__component);
      const level = Number(record.level || 2);
      const title = getChildrenText(record.children) || pickFirstString(record.title);

      if (!(type === "heading" || type.includes("heading")) || !title) {
        return null;
      }

      return {
        id: pickFirstString(record.anchorId) || `${slugify(title)}-${index}`,
        level,
        title,
      };
    })
    .filter(Boolean) as RichNode[];
};

export const renderRichContent = (content: unknown) => {
  if (typeof content === "string") {
    if (content.includes("<")) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    const parts = content.split(/\n{2,}/).filter(Boolean);
    return (
      <>
        {parts.map((part, index) => {
          const trimmed = part.trim();

          if (trimmed.startsWith("## ")) {
            return <h2 key={`content-${index}`}>{trimmed.replace(/^##\s*/, "")}</h2>;
          }

          if (trimmed.startsWith("# ")) {
            return <h1 key={`content-${index}`}>{trimmed.replace(/^#\s*/, "")}</h1>;
          }

          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n").map((item) => item.replace(/^- /, "").trim()).filter(Boolean);
            return (
              <ul key={`content-${index}`}>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }

          return <p key={`content-${index}`}>{trimmed}</p>;
        })}
      </>
    );
  }

  if (!Array.isArray(content)) {
    return null;
  }

  const headings = getRichTextHeadingNodes(content);
  let headingIndex = 0;

  return (
    <>
      {content.map((block, index) => {
        if (!isObject(block)) {
          return null;
        }

        const record = block as Record<string, unknown>;
        const type = pickFirstString(record.type, record.__component);
        const text = getChildrenText(record.children) || pickFirstString(record.title, record.body);

        if (!text) {
          return null;
        }

        if (type === "heading" || type.includes("heading")) {
          const heading = headings[headingIndex];
          headingIndex += 1;
          const rawLevel = typeof record.level === "string" ? record.level.replace("h", "") : record.level;
          const Tag = `h${Math.min(Math.max(Number(rawLevel || 2), 2), 4)}` as keyof JSX.IntrinsicElements;
          return <Tag key={`content-${index}`} id={heading?.id}>{text}</Tag>;
        }

        if (type.includes("paragraph")) {
          return <p key={`content-${index}`}>{pickFirstString(record.body, text)}</p>;
        }

        if (type === "list") {
          const ListTag = record.format === "ordered" ? "ol" : "ul";
          const items = asArray(record.children)
            .map((child) => (isObject(child) ? getChildrenText((child as Record<string, unknown>).children) : ""))
            .filter(Boolean);

          return React.createElement(
            ListTag,
            { key: `content-${index}` },
            items.map((item) => <li key={item}>{item}</li>),
          );
        }

        return <p key={`content-${index}`}>{text}</p>;
      })}
    </>
  );
};

