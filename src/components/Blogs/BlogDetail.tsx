// @ts-nocheck
/* eslint-disable */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from '@/lib/router';
import AppImage from "../Common/AppImage";
import { BLOGS } from "../Shared/constant";
import {
  fetchBlogDetail,
  fetchBlogs,
  formatBlogDate,
  getRichTextHeadingNodes,
  renderRichContent,
} from "@/lib/blogs";
import { images } from "@/content";
import { getBlogDetail, getBlogList } from "../../redux/actions";

const SOCIAL_ITEMS = [
  {
    label: "LinkedIn",
    action: (url, title) => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer"),
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

const HEADER_OFFSET = 118;

const BlogDetail = () => {
  const dispatch = useDispatch();
  const { documentId } = useParams();
  const { blogDetail, blogList } = useSelector((state) => state.allReducers);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
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
  }, [dispatch, documentId]);

  const blog = blogDetail?.documentId === documentId ? blogDetail : null;

  const tableOfContents = useMemo(() => {
    if (blog?.tableOfContents?.length) {
      return blog.tableOfContents.map((item) => ({
        id: item.anchorId || item.id,
        title: item.title,
        level: Number(String(item.level).replace("h", "")) || 2,
      }));
    }

    return getRichTextHeadingNodes(blog?.content);
  }, [blog]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleSectionScroll = useCallback((event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.history.replaceState(null, "", `#${sectionId}`);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!blog || typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.replace("#", "");

    if (!hash) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const section = document.getElementById(hash);

      if (!section) {
        return;
      }

      const top = section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: "auto" });
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [blog]);

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
    <section className="blogDetailPage">
      <div className="container-fluid">
        <div className="row" style={{ margin: '0 auto' }}>
          <div className="col-md-12">
            <div className="blogDetailPage__topLink">
              <Link to={BLOGS}>Back to Blogs</Link>
            </div>

            <div className="blogDetailPage__layout">
              <aside className="blogDetailPage__toc">
                <div className="blogDetailPage__panel">
                  <h3>Table of Contents</h3>
                  {tableOfContents.length > 0 ? (
                    <ul>
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} onClick={(event) => handleSectionScroll(event, item.id)}>{item.title}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No sections available.</p>
                  )}
                </div>
              </aside>

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
  );
};

export default BlogDetail;
