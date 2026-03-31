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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/$/, "");
  const { documentId } = req.query;

  if (!strapiUrl) {
    res.status(500).json({ error: "NEXT_PUBLIC_STRAPI_URL is not configured." });
    return;
  }

  if (!documentId || Array.isArray(documentId)) {
    res.status(400).json({ error: "documentId is required." });
    return;
  }

  try {
    const response = await fetch(`${strapiUrl}/api/blogs/${documentId}?populate=*`, {
      headers: buildHeaders(),
    });

    const data = await response.json();
    console.log("response::", data)
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Unable to reach Strapi blog detail endpoint." });
  }
}
