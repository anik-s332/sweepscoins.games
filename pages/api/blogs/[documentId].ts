import type { NextApiRequest, NextApiResponse } from "next";

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/$/, "");
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

const setCorsHeaders = (req: NextApiRequest, res: NextApiResponse) => {
  const requestOrigin = typeof req.headers.origin === "string" ? req.headers.origin : "";
  const allowOrigin = requestOrigin || "*";

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const buildStrapiHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  return headers;
};

const buildEndpoint = (slug: string) => {
  const url = new URL(`${STRAPI_URL}/api/articles`);
  url.searchParams.set("filters[slug][$eq]", slug);
  url.searchParams.set("populate", "*");
  return url.toString();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const slug = typeof req.query.documentId === "string" ? req.query.documentId : "";

  if (!slug) {
    return res.status(400).json({ message: "slug is required." });
  }

  if (!STRAPI_URL) {
    return res.status(500).json({ message: "NEXT_PUBLIC_STRAPI_URL is not configured." });
  }

  try {
    const response = await fetch(buildEndpoint(slug), {
      method: "GET",
      headers: buildStrapiHeaders(),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        message: `Unable to load blog details. Strapi responded with ${response.status}.`,
      });
    }

    const result = await response.json();
    const article = Array.isArray(result?.data) ? result.data[0] : null;

    if (!article) {
      return res.status(404).json({ message: "Blog not found for provided slug." });
    }

    return res.status(200).json({ ...result, data: article });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to load blog details." });
  }
}
