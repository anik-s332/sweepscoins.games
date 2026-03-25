// @ts-nocheck
import { images } from "@/content";
import CloseIcon from "../../../assets/img/closebutton.png";
import AppImage from "../AppImage";
const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay-crypto" >
      <div className="popup-content-crypto">
        <button className="popup-close-btn" onClick={onClose}>
          <AppImage src={images.common.closeButton} alt="Close" width={24} height={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
