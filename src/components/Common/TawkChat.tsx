import Script from "next/script";

const propertyId =
  process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "65088960b1aaa13b7a778aeb";
const widgetId =
  process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1haklh85b";

const TawkChat = () => {
  return (
    <Script
      id="tawk-chat-script"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = window.Tawk_API || {};
          var Tawk_LoadStart = new Date();
          (function() {
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "https://embed.tawk.to/${propertyId}/${widgetId}";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
};

export default TawkChat;
