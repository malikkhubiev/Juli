import { Box, Snackbar } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnWrap } from '../../../components/layout/ColumnWrap/ColumnWrap';
import { ImagesByOne } from '../../../components/logic/Images/ImagesByOne';
import { useGetOwnAndFollowingImages } from '../../../fullStore/combos/images/imagesQueries';
import { selectProfile } from '../../../fullStore/combos/profile/profilesSlice';
import { selectId, setErrorMessage, setIsLoading } from '../../../fullStore/combos/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../../fullStore/hooks';
import { RootState } from '../../../fullStore/rootStore';
import useSocket from '../../../hooks/useSocket';
import { imageType } from '../../../types/storeTypes';
import logo from "../../../assets/logo.png";

export const HomePage: FC<{}> = () => {

    const usualDispatch = useAppDispatch();
    let [getOwnAndFollowingImages] = useGetOwnAndFollowingImages();
    const { data: socketImage } = useSocket("images");
    let [images, setImages] = useState<imageType[] | []>([]);

    const id = useAppSelector((state: RootState) => selectId(state));
    const user = useAppSelector((state: RootState) => selectProfile(state, id));
    const navigate = useNavigate();

    useEffect(() => {
        if (socketImage) {
            if (window.scrollY !== 0) {
                setOpenSnackBar(true);
                setNewImagesCounter(prev => prev + 1);
            };
            if (images.length) setImages(
                prev => prev = [socketImage, ...prev]
            );
            else setImages(prev => prev = [socketImage]);
        };
    }, [socketImage]);

    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [newImagesCounter, setNewImagesCounter] = React.useState(0);

    const closeHandler = () => {
        setOpenSnackBar(false);
        setNewImagesCounter(prev => prev = 0);
    };

    const onScrollHomePageFunc = () => {
        if (window.scrollY === 0) closeHandler();
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        usualDispatch(setIsLoading(true));
        getOwnAndFollowingImages(null).unwrap()
            .then((serverImages) => {
                setImages(prev => prev = serverImages);
            })
            .catch(e => usualDispatch(setErrorMessage(e.data.message)));
        usualDispatch(setIsLoading(false));
    }, []);

    useEffect(() => {
        if (user?.isFirstTime) {
            navigate("preferences");
        };
    }, [user]);

    return (
        <ColumnWrap>
            <img
                style={{ width: "100px" }}
                src={logo}
            />
            {
                images.length ?
                    <>
                        <Snackbar
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                            open={openSnackBar}
                            message={`${newImagesCounter} new images`}
                        />
                        <ImagesByOne
                            onScrollHomePageFunc={onScrollHomePageFunc}
                            images={images}
                        />
                    </> : <></>
            }
        </ColumnWrap>
    );
};