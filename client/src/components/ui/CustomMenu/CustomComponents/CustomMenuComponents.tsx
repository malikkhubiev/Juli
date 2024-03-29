import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import styles from './CustomMenuComponents.module.less';

const urlOutside = "https://www.youtube.com/";

export const BasicMenuComponent: FC<{ body: string, icon: FC<any> }> = (props) => {
    return <div className={styles.component}>
        {props.icon && <props.icon />}
        <Box className={styles.box}>
            <Typography variant="body2">{props.body}</Typography>
        </Box>
    </div>
};

export const ButtonComponent: FC<{ button: FC<any>, icon: FC<any>, name: string, url: string }> = (props) => {
    return <props.button url={props.url}>
        <div className={styles.component}>
            {props.icon && <props.icon size={32} round={true} />}
            <Box className={styles.box}>
                <Typography variant="body2">{props.name}</Typography>
            </Box>
        </div>
    </props.button>
};