// @ts-nocheck
/* eslint-disable */
import React from "react";
import { content, images } from "@/content";
import {
  PRIVACY_POLICY,
  TERMS_CONDITIONS,
  PROMOTIONAL_RULES,
  CONTACT,
  HOME_URL,
  RESPONSIBLE_GAME_PLAY,
} from "../../Shared/constant";
import { Link, useLocation } from '@/lib/router';
import AppImage from "../../Common/AppImage";

const Footer = () => {
  const Location = useLocation();
  const footerContent = content.shared.footer;

  const ScrolltoGame = () => {
    const GocontactForm = document.getElementById("root");
    GocontactForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <React.Fragment>
      {Location?.pathname !== "/packages" && (
        <div className="powerbysections powerbysectionsfooter">
          <Link
            to={HOME_URL}
            onClick={() => ScrolltoGame()}
            className="sweepscoinbtn"
          >
            {footerContent.ctaButton}
          </Link>
          <h3>{footerContent.ctaHeading}</h3>
        </div>
      )}
      <footer className="footer_section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="footwrapper">
                <div className="col-md-4">
                  <div className="contactlinks">
                    <h4>{footerContent.contactHeading}</h4>
                    <ul>
                      <li>
                        <a href={`mailto:${footerContent.supportEmail}`}>
                          {footerContent.supportEmail}
                        </a>
                      </li>
                      <li className="d-flex flex-column justify-content-center align-items-center">
                        {footerContent.addressLines.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6 col-xs-6 footprofilecol">
                  <div className="contactlinks">
                    <h4>{footerContent.policyHeading}</h4>
                    <ul>
                      <li>
                        <Link to={CONTACT}>{footerContent.policyLinks.contact}</Link>
                      </li>
                      <li>
                        <Link to={PRIVACY_POLICY}>{footerContent.policyLinks.privacy}</Link>
                      </li>
                      <li>
                        <Link to={PROMOTIONAL_RULES}>{footerContent.policyLinks.promotionalRules}</Link>
                      </li>
                      <li>
                        <Link to={RESPONSIBLE_GAME_PLAY}>{footerContent.policyLinks.responsibleGamePlay}</Link>
                      </li>
                      <li>
                        <Link to={TERMS_CONDITIONS}>{footerContent.policyLinks.terms}</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contadetails">
                    <AppImage src={images.shared.logo} alt={footerContent.logoAlt} width={144} height={144} />
                  </div>
                </div>
              </div>
              <div className="copyright">
                &copy; {new Date().getFullYear()} {footerContent.copyrightSuffix}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
