import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useLib } from "./lib2";
import { autorun } from "mobx";

export default observer<any>(() => {
    // either hook
    const queryItemsStore = useLib("queryItems");

    useLib("pendingItems", async ({ store, onDispose }) => {
        // or store. I can distructure it here  because queryItems is observable
        const { queryItems } = store["queryItems"];
        const userStore = store["user"]; // we can safely require other stores but keep you logic clean so that it allows to everything being GC'd nicely
        const dispose = autorun(
            async () => {
                // it's still sync so this is tracked
                const fetches = queryItems.pending.map(async (item) => {
                    const response = await fetch(
                        `/api/${userStore.userId}/items/status?id=${item.id}`
                    );
                    // potential memory leak if queryItems is not GC'd in case this component unmounted
                    item.status = response.status;
                });
                if (fetches.length) {
                    await Promise.all(fetches);
                }
            },
            { delay: 5000 } // polling evrey 5 sec
        );
        onDispose(() => {
            dispose();
        });
    });

    return (
        queryItemsStore.loading ||
        queryItemsStore.queryItems.items.map((item) => (
            <ListItem disablePadding key={item.title}>
                <ListItemButton>
                    <ListItemIcon>
                        {item?.status === 2 ? (
                            <DownloadDoneIcon />
                        ) : (
                            <HourglassTopIcon />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItemButton>
            </ListItem>
        ))
    );
});
