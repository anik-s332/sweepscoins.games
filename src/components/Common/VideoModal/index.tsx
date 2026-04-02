// @ts-nocheck
/* eslint-disable */
import React from "react";

const VideoModal = (props) => {
    const { videoModal, setVideoModal } = props;

    // close modal
    const CloseModal = () => {
        setVideoModal({...videoModal, open: false})
    }

    return(<div className="videoModalwrapper" onClick={() => CloseModal()}>
        <button className="colmn-model" onClick={() => CloseModal()}>
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="82.189 55.096 481.811 481.808" xmlns="http://www.w3.org/2000/svg" viewBox="82.189 55.096 481.811 481.808" role="presentation" aria-hidden="true"><g><path d="M531.936 536.904L323.094 328.063 114.253 536.904l-32.064-32.062L291.032 296 82.189 87.157l32.064-32.061 208.842 208.842L531.936 55.096 564 87.157 355.155 296 564 504.842l-32.064 32.062z"></path></g></svg>
        </button>
        <div className="videoplayer">
            <iframe width="962" height="541" src={`https://www.youtube.com/embed/${videoModal.url.split("/")[videoModal.url.split("/").length - 1]}`} title="Orion Star Sweepstakes Games" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
    </div>)
}

export default VideoModal;
