import React, {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
} from "react";
import NextLink from "next/link";
import Router from "next/router";
import type { UrlObject } from "url";

type NavigationOptions = {
  replace?: boolean;
  state?: unknown;
};

type ToValue = string | UrlObject;

type RouteProps = {
  path: string;
  element: React.ReactNode;
};

type LocationShape = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
};

const ParamsContext = createContext<Record<string, string>>({});

const NAVIGATION_STATE_KEY = "__next_router_state__";

const serializeQueryValue = (value: unknown): string =>
  Array.isArray(value)
    ? value.map((item) => String(item)).join("/")
    : String(value);

const toHref = (to: ToValue): string => {
  if (typeof to === "string") {
    return to.startsWith("/") || to.startsWith("http") ? to : `/${to}`;
  }

  const pathname = to.pathname ? (to.pathname.startsWith("/") ? to.pathname : `/${to.pathname}`) : "/";
  const query = to.query
    ? Object.entries(to.query)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(serializeQueryValue(value))}`)
        .join("&")
    : "";
  const hash = typeof to.hash === "string" ? to.hash : "";

  return `${pathname}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
};

const normalizeTo = (to: ToValue) => toHref(to);

const readStateBucket = (): Record<string, unknown> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(sessionStorage.getItem(NAVIGATION_STATE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeStateBucket = (bucket: Record<string, unknown>) => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(bucket));
};

const storeNavigationState = (to: ToValue, state: unknown) => {
  if (state === undefined) {
    return;
  }

  const bucket = readStateBucket();
  bucket[normalizeTo(to).split("?")[0]] = state;
  writeStateBucket(bucket);
};

const getNavigationState = (path: string) => {
  const bucket = readStateBucket();
  return bucket[normalizeTo(path)];
};

const splitRoute = (value: string) =>
  value.split("/").filter(Boolean);

const matchRoute = (routePath: string, pathname: string) => {
  if (routePath === "*") {
    return {
      matched: true,
      score: -1,
      params: {},
    };
  }

  const routeSegments = splitRoute(routePath);
  const pathSegments = splitRoute(pathname);

  if (routeSegments.length !== pathSegments.length) {
    return {
      matched: false,
      score: -1,
      params: {},
    };
  }

  const params: Record<string, string> = {};
  let score = 0;

  for (let index = 0; index < routeSegments.length; index += 1) {
    const routeSegment = routeSegments[index];
    const pathSegment = pathSegments[index];

    if (routeSegment.startsWith(":")) {
      params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
      score += 2;
      continue;
    }

    if (routeSegment !== pathSegment) {
      return {
        matched: false,
        score: -1,
        params: {},
      };
    }

    score += 3;
  }

  return {
    matched: true,
    score,
    params,
  };
};

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const Route = (_props: RouteProps) => null;

export const Routes = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const routeElements = Children.toArray(children).filter(isValidElement) as React.ReactElement<RouteProps>[];

  const matchedRoute = useMemo(() => {
    return routeElements
      .map((routeElement) => {
        const result = matchRoute(routeElement.props.path, location.pathname);

        return {
          routeElement,
          ...result,
        };
      })
      .filter((item) => item.matched)
      .sort((left, right) => right.score - left.score)[0];
  }, [location.pathname, routeElements]);

  if (!matchedRoute) {
    return null;
  }

  return (
    <ParamsContext.Provider value={matchedRoute.params}>
      {matchedRoute.routeElement.props.element}
    </ParamsContext.Provider>
  );
};

export const Navigate = ({
  replace,
  to,
}: {
  replace?: boolean;
  to: ToValue;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
};

export const Link = ({
  children,
  onClick,
  replace,
  to,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  replace?: boolean;
  to: ToValue;
}) => {
  const href = toHref(to);

  if (href.startsWith("http")) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={to} onClick={onClick} replace={replace} {...props}>
      {children}
    </NextLink>
  );
};

export const useNavigate = () => {
  return (to: ToValue, options: NavigationOptions = {}) => {
    storeNavigationState(to, options.state);

    if (options.replace) {
      Router.replace(to);
      return;
    }

    Router.push(to);
  };
};

export const useLocation = (): LocationShape => {
  const asPath =
    Router.asPath ||
    (typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}${window.location.hash}`
      : "/");
  const [pathname, search = ""] = asPath.split("?");

  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: "",
    state: getNavigationState(pathname),
  };
};

export const useParams = <T extends Record<string, string> = Record<string, string>>() =>
  useContext(ParamsContext) as T;
