// @ts-nocheck
/* eslint-disable */
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from '@/lib/router';
import AppImage from "../Common/AppImage";
import { images } from "@/content";

const BannerSection = () => {
    const videoEl = useRef(null);
    const Navigate = useNavigate();
    const [isFirefox, setIsFirefox] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const attemptPlay = () => {
        videoEl &&
        videoEl.current &&
        videoEl.current.play().catch(error => {
            console.error("Error attempting to play", error);
        });
    };

    useEffect(() => {
        attemptPlay();
    }, []);

    useEffect(() => {
      if (typeof navigator !== "undefined") {
        setIsFirefox(navigator?.userAgent?.toLowerCase()?.includes("firefox"));
      }
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    }, []);
    const containerStyle = isFirefox ? { width: "10000px" } : {};
    const dragonImage = isMobile ? images.home.mobileDragon : images.home.dragon;
    const bannerGuyImage = isMobile ? images.home.mobileGuy : images.home.bannerGuy;

    return(<section className="bannerSectionWrp">
  <div className="banner">
    <div className="banner_container container d-flex flex-column flex-md-row justify-content-center align-items-start align-items-md-center">
      <div className="banner-content d-flex gap-4 flex-column">
        <h1>WELCOME TO SWEEPS COINS CASINO</h1>
        <button onClick={() => Navigate("/packages")} className="buy_bunndle_button">BUY BUNDLE PLAY NOW</button>
      </div>
      <div
      style={containerStyle}
      className="d-flex gap-2 gap-sm-2 flex-row align-items-baseline mt-4 mt-mobile-4rem">
           <AppImage src={dragonImage} alt="Dragon" className="w-100 banner_images Dragon" width={640} height={640} sizes="(max-width: 640px) 48vw, 32vw" />
           <AppImage src={bannerGuyImage} alt="BannerGuy" className="w-100 banner_images Dragon2" width={640} height={640} sizes="(max-width: 640px) 48vw, 32vw" />
      </div>
      <div>

      </div>
    </div>
  </div>

    </section>)
};

export default memo(BannerSection);
