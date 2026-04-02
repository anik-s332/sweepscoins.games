// @ts-nocheck
/* eslint-disable */
import { memo } from "react";
import { useSelector } from "react-redux";
import AppImage from "../Common/AppImage";

const GamesGrid = (props) => {
    const { setVideoModal } = props;
    const { products } = useSelector((state) => state.allReducers);
    const UrlRgx = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    const OpenVideoModal = (video) => {
        if(UrlRgx.test(video.video_url)) {
            setVideoModal((currentVideoModal) => ({
                ...currentVideoModal,
                open: true,
                url: video.video_url,
            }));
        }
    };

    return(
        <>
    <section className="GamesGridwrapper" id="GamesGridwrapper">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="gamesgridset">
                        <div className="row">
                            {products && products?.map((game, index) => {
                                return(<div className="col-md-3 col-xs-6" key={index}>
                                    <div className="gamelistwraps" onClick={() => OpenVideoModal(game)}>
                                        <AppImage src={game?.product_img_path} alt={game?.name} width={320} height={320} sizes="(max-width: 767px) 50vw, 25vw" />
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
   <div className="row">
    <h1 className="footer_title">Earn 100 <span style={{ fontFamily: "Arial, sans-serif",display:"contents",fontWeight:"bold" }}>%</span> <span className="footer_title__mobile_break"><br /></span>Match on<br /> Your First Purchase <span style={{ fontFamily: "Arial, sans-serif",display:"contents",fontWeight:"bold" }}>!</span></h1>
   </div>
        </>
    )
};

export default memo(GamesGrid);
