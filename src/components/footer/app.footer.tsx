'use client'
import { useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useContext } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
const AppFooter = () => {
    const hasMounted = useHasMounted();

    if(!hasMounted) return (<></>)

    const {currentTrack,setCurrentTrack} = useTrackContext() as ITrackContext;

    return(
        <div style={{marginTop: 50}}>
            <AppBar 
            position="fixed"  sx={{ top: 'auto', bottom: 0,background: "#f2f2f2" }}>
                <Container sx={{display: "flex", columnGap: "50px",".rhap_main": {gap: "30px"}}}>
                    <AudioPlayer
                        layout="horizontal-reverse"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                        volume={0.5}
                        style={{
                            boxShadow: "unset",
                            background: "#f2f2f2"
                        }}
                        />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                        minWidth: "100px"
                    }}>
                        <div style={{ color: "#ccc"}}>Eric</div>
                        <div style={{ color: "black"}}>Who Am I?</div>
                    </div>
                </Container>
            </AppBar>
        </div>
    )
}

export default AppFooter;