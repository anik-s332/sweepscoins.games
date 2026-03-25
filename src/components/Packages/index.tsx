// @ts-nocheck
/* eslint-disable */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PACKAGES_LIST_API_URL, CHECK_OUT_PACKAGE } from "../Shared/constant";
import BackgroundImage from "../../assets/img/SweepsCoins-WebsitePackages-Deliverable-Background.svg";
import { CallLogoutUser, getPackageLists, AddToCartPosters } from "../../redux/actions";
import { useNavigate } from '@/lib/router';
import { content, images } from "@/content";
import AppImage from "../Common/AppImage";

const Packages = () => {
    const Navigate = useNavigate();
    const { packageList } = useSelector((state) => state.allReducers);
    const dispatch = useDispatch();
    const packagesContent = content.packages;

    useEffect(() => {
        window.axios.get(`${PACKAGES_LIST_API_URL}/5000/1`, {
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }}).then(function (result) {
            if(result?.status === 200) {
                dispatch(getPackageLists(result?.data?.data));
            } else {
                dispatch(getPackageLists([]));
            };
        }).catch(function (result) {
            dispatch(getPackageLists([]));
            if(result?.response?.status === 403) {
                dispatch(CallLogoutUser());
                localStorage.removeItem("accessToken");
                localStorage.removeItem("access_tokens");
            };
        });
    }, [dispatch]);

    const AddToCart = (elm) => {
        dispatch(AddToCartPosters(elm));
        setTimeout(() => Navigate(CHECK_OUT_PACKAGE), 100);
    };

    const safePackageList = Array.isArray(packageList) ? packageList : [];
    const sortedPackageList = [...safePackageList].sort(function(a, b) {return a.price - b.price;});

    return(<section className="packagespage" style={{ backgroundImage: `url(${BackgroundImage})` }}>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="packagesContainer">
                        <h1>{packagesContent.pageTitle}</h1>
                        <div className="packages_wrapps">
                            {sortedPackageList?.map((elm, index) => {
                                return(<div className="package_cols"  onClick={() => AddToCart(elm)} key={index}>
                                    <h4>{elm?.name}</h4>
                                    {elm?.package_image_path === null ? (
                                        <AppImage src={images.common.defaultProduct} alt="image" width={220} height={220} />
                                    ) : (
                                        <AppImage src={elm?.package_image_path} alt="image" width={220} height={220} />
                                    )}
                                    <div className="coinswrps">
                                        <h3>{elm?.title}</h3>
                                        <h5><b>{Number(elm?.sweep_coins).toLocaleString()}</b> {packagesContent.sweepsCoinsSuffix}</h5>
                                        <button type="button" className="btn " onClick={() => AddToCart(elm)}>
                                            {packagesContent.selectButtonPrefix}&nbsp;${Number(elm?.price).toLocaleString()} {packagesContent.currencySuffix}
                                        </button>
                                    </div>
                                </div>)})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>)
}

export default Packages;
