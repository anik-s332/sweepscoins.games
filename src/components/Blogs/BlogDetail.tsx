// @ts-nocheck
/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter as useNextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "@/lib/router";
import AppImage from "../Common/AppImage";
import { BLOGS } from "../Shared/constant";
import {
  fetchBlogDetail,
  fetchBlogs,
  formatBlogDate,
  renderRichContent,
} from "@/lib/blogs";
import { images } from "@/content";
import { getBlogDetail, getBlogList } from "../../redux/actions";

const SOCIAL_ITEMS = [
  {
    label: "LinkedIn",
    action: (url) => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer"),
    short: "in",
  },
  {
    label: "Facebook",
    action: (url) => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer"),
    short: "f",
  },
  {
    label: "X",
    action: (url, title) => window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "noopener,noreferrer"),
    short: "x",
  },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sweepscoins.cash";

const BlogDetail = () => {
  const dispatch = useDispatch();
  const nextRouter = useNextRouter();
  const params = useParams();
  const { blogDetail, blogList } = useSelector((state) => state.allReducers);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const documentId = useMemo(() => {
    if (typeof params?.documentId === "string" && params.documentId) {
      return params.documentId;
    }

    if (typeof nextRouter.query?.documentId === "string" && nextRouter.query.documentId) {
      return nextRouter.query.documentId;
    }

    const pathname = typeof nextRouter.asPath === "string" ? nextRouter.asPath.split("?")[0] : "";
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] === "blogs" ? segments[1] || "" : "";
  }, [nextRouter.asPath, nextRouter.query?.documentId, params?.documentId]);

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      if (!documentId) {
        if (isMounted) {
          setLoading(false);
          setErrorMessage("Blog not found.");
        }
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const blogsPromise = Array.isArray(blogList) && blogList.length > 0 ? Promise.resolve(blogList) : fetchBlogs();
        const detailPromise = blogDetail?.documentId === documentId ? Promise.resolve(blogDetail) : fetchBlogDetail(documentId);
        const [detailResponse, blogsResponse] = await Promise.all([detailPromise, blogsPromise]);

        if (!isMounted) {
          return;
        }

        if (Array.isArray(blogsResponse) && blogsResponse.length > 0) {
          dispatch(getBlogList(blogsResponse));
        }

        dispatch(getBlogDetail(detailResponse));
        setPopularBlogs(
          detailResponse?.popularArticles?.length
            ? detailResponse.popularArticles
            : blogsResponse.filter((item) => item.documentId !== documentId).slice(0, 5),
        );
        document.title = detailResponse?.title ? `${detailResponse.title} | Sweeps Coins` : "Blog Details | Sweeps Coins";
      } catch (error) {
        if (isMounted) {
          dispatch(getBlogDetail(null));
          setErrorMessage(error instanceof Error ? error.message : "Unable to load blog details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [blogDetail, blogList, dispatch, documentId]);

  const blog = blogDetail?.documentId === documentId ? blogDetail : null;
  const currentUrl = typeof window !== "undefined" ? window.location.href : `${SITE_URL}${BLOGS}/${documentId}`;
  const shareImage = blog?.image || `${SITE_URL}/sweepcoinscash-01.png`;
  const shareDescription = blog?.excerpt || "Read the latest Sweeps Coins blog article, insights, and featured updates.";

  if (loading) {
    return (
      <div className="pageisLoading" id="pageisLoading">
        <div className="pageloadiwraps">
          <img src="/pageisloading.gif" alt="loading" />
          <span>Please Wait ...</span>
        </div>
      </div>
    );
  }

  if (errorMessage || !blog) {
    return (
      <section className="blogDetailPage">
        <div className="container">
          <div className="blogDetailPage__state blogDetailPage__state--error">{errorMessage || "Blog not found."}</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.title} | Sweeps Coins</title>
        <meta name="description" content={shareDescription} />
        <meta property="og:title" content={`${blog.title} | Sweeps Coins`} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:title" content={`${blog.title} | Sweeps Coins`} />
        <meta name="twitter:description" content={shareDescription} />
        <meta name="twitter:image" content={shareImage} />
      </Head>
      <section className="blogDetailPage">
        <div className="container-fluid">
          <div className="row" style={{ margin: "0 auto" }}>
            <div className="col-md-12">
              <div className="blogDetailPage__topLink">
                <Link to={BLOGS}>Back to Blogs</Link>
              </div>

              <div className="blogDetailPage__layout">
                <article className="blogDetailPage__article">
                  <h1>{blog.title}</h1>
                  <div className="blogDetailPage__meta">
                    <span>{formatBlogDate(blog.publishedAt)}</span>
                  </div>

                  <div className="blogDetailPage__hero">
                    <AppImage
                      src={blog.image || images.common.defaultProduct}
                      fallbackSrc={images.common.defaultProduct}
                      alt={blog.title}
                      width={940}
                      height={420}
                      className="blogDetailPage__heroImage"
                      unoptimized
                      priority
                    />
                  </div>

                  <div className="blogDetailPage__content">
                    {renderRichContent(blog.content)}
                  </div>

                  {blog.relatedBlogs?.length > 0 && (
                    <div className="blogDetailPage__related">
                      <h3>Related articles</h3>
                      <div className="blogDetailPage__relatedGrid">
                        {blog.relatedBlogs.map((item) => (
                          <Link key={item.documentId} to={`${BLOGS}/${item.documentId}`} className="blogDetailPage__relatedCard">
                            <AppImage
                              src={item.image || images.common.defaultProduct}
                              fallbackSrc={images.common.defaultProduct}
                              alt={item.title}
                              width={280}
                              height={180}
                              unoptimized
                            />
                            <div>
                              <h4>{item.title}</h4>
                              <span>{formatBlogDate(item.publishedAt)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </article>

                <aside className="blogDetailPage__sidebar">
                  <div className="blogDetailPage__panel">
                    <h3>Share</h3>
                    <div className="blogDetailPage__share">
                      {SOCIAL_ITEMS.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className={item.label}
                          onClick={() => item.action(currentUrl, blog.title)}
                          aria-label={item.label}
                        >
                          {item.short}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="blogDetailPage__panel">
                    <h3>Popular articles</h3>
                    <div className="blogDetailPage__popular">
                      {popularBlogs.map((item) => (
                        <Link key={item.documentId} to={`${BLOGS}/${item.documentId}`} className="blogDetailPage__popularItem">
                          <AppImage
                            src={item.image || images.common.defaultProduct}
                            fallbackSrc={images.common.defaultProduct}
                            alt={item.title}
                            width={88}
                            height={60}
                            unoptimized
                          />
                          <div>
                            <h4>{item.title}</h4>
                            <span>{formatBlogDate(item.publishedAt)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;
