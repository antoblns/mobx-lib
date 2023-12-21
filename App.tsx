import React from "react";
import logo from "./logo.svg";
import "./App.css";
// import { cartItemsVar } from "./cache";
// import {} from "./lib";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Button, Grid, TextField } from "@mui/material";
import QueryItems from "./QueryItems";
import { list as fetchedList } from "./queryItemsData";
import {
    autorun,
    extendObservable,
    makeAutoObservable,
    observable,
    reaction,
    runInAction,
} from "mobx";
import { useLib } from "./lib2";
// immer would do improvement but it is waste of time

function App() {
    // Don't destructure unless deliberetly operate with nested observables! store is not used in this component but e.g. store.data can be rendered.
    const store = useLib(
        "queryItems",
        async ({ Return, store, onDispose, createReactiveVar }) => {
            const queryItems = createReactiveVar({
                items: [],
                get pending() {
                    return this.items.filter((i) => i.status == 2);
                },
            });
            // put it before async calls for child components to recieve api
            Return({
                refetch: async (params) => {
                    const list = await fetch(`/api/items/get`).then((r) =>
                        r.json()
                    );
                    queryItems.items = list;
                },
                queryItems, // it will be GC'd so it's safe to return it unless it is used in not disposed places.
            });
            const list = await fetch(`/api/items/get`).then((r) => r.json());
            // make it cool with yield but need to know how to postpone execution of a part of code
            // make reaction on this
            //api.refetch=...

            runInAction(() => {
                // in case not using mobx
                store.data = list;
                queryItems.items = list;
            });
        }
    );

    return (
        <div className="App">
            <Grid container>
                <Grid item xs={6}>
                    <Box>
                        <TextField
                            label="Create new item"
                            multiline
                            maxRows={4}
                            onChange={() => {}}
                        />
                        <Button variant="contained">Create</Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                        }}
                    >
                        <List>
                            <QueryItems />
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
