// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from '@/lib/router';
import AppImage from "../Common/AppImage";
import { images } from "@/content";

const BannerSection = ({width}) => {
    const videoEl = useRef(null);
    const Navigate = useNavigate()

    const attemptPlay = () => {
        videoEl &&
        videoEl.current &&
        videoEl.current.play().catch(error => {
            console.error("Error attempting to play", error);
        });
    };

    useEffect(() => {
        attemptPlay();
    }, [ ]);

    const [isFirefox, setIsFirefox] = useState(false);
    useEffect(() => {
      if (typeof navigator !== "undefined") {
        setIsFirefox(navigator?.userAgent?.toLowerCase()?.includes("firefox"));
      }
    }, []);
    const containerStyle = isFirefox ? { width: "10000px" } : {};

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
           <AppImage src={width>640 ? images.home.dragon : images.home.mobileDragon} alt="Dragon" className="w-100 banner_images Dragon" width={640} height={640} priority />
           <AppImage src={width>640 ? images.home.bannerGuy: images.home.mobileGuy} alt="BannerGuy" className="w-100 banner_images Dragon2" width={640} height={640} priority />
      </div>
      <div>

      </div>
    </div>
  </div>

    </section>)
}

export default BannerSection;
