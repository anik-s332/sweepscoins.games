import { Head, Html, Main, NextScript } from "next/document";

const paymentHelpersScript = `
  function closeModal() {
    const tokenContainer = document.getElementById("iframPayment");
    const iframPaymentBack = document.getElementById("iframPaymentBack");
    if (tokenContainer) tokenContainer.style.display = "none";
    if (iframPaymentBack) iframPaymentBack.style.display = "none";

    const iframeId = document.querySelector("iframe")?.id;
    const iframe = iframeId ? document.getElementById(iframeId) : null;
    if (iframe && iframe.src) {
      iframe.src = iframe.src;
    }
  }

  if (typeof window !== "undefined") {
    window.closeModal = closeModal;
  }
`;

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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://i4m.i4go.com/css/wallets.css"
        />
        <script src="https://cdn.geocomply.com/161/gc-html5.js" />
        <script src="https://myportal.shift4.com/js/jquery/jquery-3.5.1.min.js" />
        <script src="https://i4m.shift4test.com/js/jquery.i4goTrueToken.js" />
        <script src="https://i4m.shift4test.com/js/jquery.cardswipe.js" />
        <script src="https://pay.google.com/gp/p/js/pay.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: paymentHelpersScript,
          }}
        />
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
