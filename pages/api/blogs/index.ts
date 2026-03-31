import type { NextApiRequest, NextApiResponse } from "next";

const buildHeaders = () => {
  const token = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/$/, "");

  if (!strapiUrl) {
    res.status(500).json({ error: "NEXT_PUBLIC_STRAPI_URL is not configured." });
    return;
  }

  try {
    const query = new URLSearchParams();
    query.set("populate", "*");

    Object.entries(_req.query).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
        return;
      }

      query.set(key, value);
    });

    const response = await fetch(`${strapiUrl}/api/blogs?${query.toString()}`, {
      headers: buildHeaders(),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Unable to reach Strapi blogs endpoint." });
  }
}
