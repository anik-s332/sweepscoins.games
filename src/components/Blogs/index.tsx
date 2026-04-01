// @ts-nocheck
/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "@/lib/router";
import { BLOGS } from "../Shared/constant";
import AppImage from "../Common/AppImage";
import { fetchBlogs, formatBlogDate } from "@/lib/blogs";
import { images } from "@/content";
import { getBlogList } from "../../redux/actions";

const PAGE_SIZE = 6;

const SOCIAL_ITEMS = [
  { label: "LinkedIn", href: "https://www.linkedin.com", short: "in" },
  { label: "Facebook", href: "https://www.facebook.com", short: "f" },
  { label: "X", href: "https://x.com", short: "x" },
];

const Blogs = () => {
  const dispatch = useDispatch();
  const { blogList } = useSelector((state) => state.allReducers);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Blogs | Sweeps Coins";
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBlogs = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetchBlogs();

        if (isMounted) {
          dispatch(getBlogList(response));
        }
      } catch (error) {
        if (isMounted) {
          dispatch(getBlogList([]));
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load blogs."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const blogs = Array.isArray(blogList) ? blogList : [];

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        normalizedSearch === "" ||
        blog.title.toLowerCase().includes(normalizedSearch) ||
        blog.excerpt.toLowerCase().includes(normalizedSearch);

      return matchesSearch;
    });
  }, [blogs, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <Head>
        <title>Blogs | Sweeps Coins</title>
        <meta
          name="description"
          content="Read the latest Sweeps Coins blogs, product updates, expert insights, and featured articles in one place."
        />
      </Head>
      <section className="blogsPage" id="GamesGridwrapper">
        <div className="container-fluid">
          <div className="row" style={{ margin: "0 auto" }}>
            <div className="col-md-12">
              <div className="blogsPage__header">
                <h1>Blogs</h1>
              </div>
              <div className="blogsPage__layout">
                <div className="blogsPage__feed">
                  {loading && (
                    <div className="pageisLoading" id="pageisLoading">
                      <div className="pageloadiwraps">
                        <img src="/pageisloading.gif" alt="loading" />
                        <span>Please Wait ...</span>
                      </div>
                    </div>
                  )}
                  {errorMessage && <div className="blogsPage__state blogsPage__state--error">{errorMessage}</div>}
                  {!loading && !errorMessage && paginatedBlogs.length === 0 && <div className="blogsPage__state">No blogs found.</div>}

                  {!loading && !errorMessage && paginatedBlogs.map((blog) => (
                    <Link key={blog.documentId} to={`${BLOGS}/${blog.documentId}`} className="blogCard">
                      <div className="blogCard__imageWrap">
                        <AppImage
                          src={blog.image || images.common.defaultProduct}
                          fallbackSrc={images.common.defaultProduct}
                          alt={blog.title}
                          width={320}
                          height={185}
                          className="blogCard__image"
                        />
                      </div>
                      <div className="blogCard__body">
                        <h2>{blog.title}</h2>
                        <p className="blogCard__excerpt">{blog.excerpt}</p>
                        <span className="blogCard__date">{formatBlogDate(blog.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}

                  {!loading && !errorMessage && totalPages > 1 && (
                    <div className="blogPagination">
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          className={pageNumber === currentPage ? "active" : ""}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="blogPagination__next"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                <aside className="blogsSidebar">
                  <div className="blogsSidebar__card blogsSidebar__search">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Search blogs..."
                    />
                  </div>

                  <div className="blogsSidebar__card">
                    <h3>Social Links</h3>
                    <div className="blogsSidebar__socials">
                      {SOCIAL_ITEMS.map((item) => (
                        <a key={item.label} href={item.href} className={item.label} target="_blank" rel="noreferrer" aria-label={item.label}>
                          {item.short}
                        </a>
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

export default Blogs;
