import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="cache-control" content="max-age=0" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fevicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="/fonts/stylesheet.css" />
      </Head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Main />
        <div className="pageisLoading" id="pageisLoading" style={{ display: "none" }}>
          <div className="pageloadiwraps">
            <img src="/pageisloading.gif" alt="loading" />
            <span>Please Wait ...</span>
          </div>
        </div>
        <div
          className="spoofingDetectionModel"
          id="spoofingDetectionModel"
          style={{ display: "none" }}
        >
          <div className="spoofingDetectionModelCONTEND">
            <p>
              For Security purposes, you are required to turn <br />
              off browser extensions. Please disable, then try
              <br />
              again or refresh the page.
            </p>
            <button type="button" id="TryAgainGeoComplyt">
              Try again
            </button>
          </div>
        </div>
        <div
          className="ModalBackground"
          id="iframPaymentBack"
          style={{ display: "none" }}
        />
        <NextScript />
      </body>
    </Html>
  );
}
