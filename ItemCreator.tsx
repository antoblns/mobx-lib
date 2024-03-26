import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Button, Grid, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useLib } from "./lib2";

export default observer(() => {
    const [list] = useLib("fe");
    return (
        <Box>
            <TextField
                label="Create new item"
                multiline
                maxRows={4}
                onChange={() => {}}
            />
            <Button variant="contained">Create</Button>
        </Box>
    );
});
