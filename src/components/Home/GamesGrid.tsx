// @ts-nocheck
/* eslint-disable */
import { useSelector } from "react-redux";
import AppImage from "../Common/AppImage";

const GamesGrid = (props) => {
    const { videoModal, setVideoModal,width } = props;
    const { products } = useSelector((state) => state.allReducers);
    const UrlRgx = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    const OpenVideoModal = (video) => {
        if(UrlRgx.test(video.video_url)) {
            setVideoModal({
                ...videoModal,
                open: !videoModal.open,
                url: video.video_url,
            });
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
                                        <AppImage src={game?.product_img_path} alt={game?.name} width={320} height={320} />
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
{props?.width>640 ?
    <h1 className="footer_title">Earn 100  <span style={{ fontFamily: "Arial, sans-serif",display:"contents",fontWeight:"bold" }}>%  </span> Match on<br></br> Your First Purchase <span style={{ fontFamily: "Arial, sans-serif",display:"contents",fontWeight:"bold" }}>!</span> </h1>:
    <h1 className="footer_title">Earn 100  <span style={{ fontFamily: "Arial, sans-serif",display:"contents",fontWeight:"bold" }}>%  </span><br></br>  Match on Your<br></br> First Purchase <span style={{ fontFamily: "Arial, sans-serif",display:"contents",fontWeight:"bold" }}>!</span> </h1>
}
   </div>
        </>
    )
}

export default GamesGrid;
