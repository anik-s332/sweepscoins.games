import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "@/assets/css/media.css";
import "@/assets/css/style.css";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import PageLoad from "@/PageLoad";
import TawkChat from "@/components/Common/TawkChat";
import { checkLogin, getAccessToken } from "@/redux/actions";
import store, { persistor } from "@/redux/store";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { accessToken, is_login } = useSelector((state: any) => state.allReducers);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("access_tokens") ||
      localStorage.getItem("accessToken") ||
      "";

    if (storedToken) {
      if (accessToken !== storedToken) {
        dispatch(getAccessToken(storedToken));
      }

      if (is_login !== "yes") {
        dispatch(checkLogin("yes"));
      }

      localStorage.setItem("access_tokens", storedToken);
      localStorage.setItem("accessToken", storedToken);
    } else if (accessToken) {
      localStorage.setItem("access_tokens", accessToken);
      localStorage.setItem("accessToken", accessToken);
    }

    setIsReady(true);
  }, [accessToken, dispatch, is_login]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const content = <Component {...pageProps} />;

  return (
    <Provider store={store}>
      {typeof window === "undefined" ? (
        content
      ) : (
        <PersistGate loading={null} persistor={persistor}>
          <AuthBootstrap>
            {content}
            <TawkChat />
          </AuthBootstrap>
        </PersistGate>
      )}
      <PageLoad />
    </Provider>
  );
}
