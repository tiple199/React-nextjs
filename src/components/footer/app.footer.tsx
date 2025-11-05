'use client'
import { useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useContext, useRef } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
const AppFooter = () => {
    const {currentTrack,setCurrentTrack} = useTrackContext() as ITrackContext;
    const playRef = useRef(null);
    const hasMounted = useHasMounted();

    if(!hasMounted) return (<></>)
    if(currentTrack?.isPlaying){
        //@ts-ignore
        playRef?.current?.audio?.current.play();   
    }
    else{
         //@ts-ignore
        playRef?.current?.audio?.current.pause();
    }
    return(
        <div style={{marginTop: 50}}>
            <AppBar 
            position="fixed"  sx={{ top: 'auto', bottom: 0,background: "#f2f2f2" }}>
                <Container sx={{display: "flex", columnGap: "50px",".rhap_main": {gap: "30px"}}}>
                    <AudioPlayer
                        ref={playRef}
                        layout="horizontal-reverse"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                        volume={0.5}
                        style={{
                            boxShadow: "unset",
                            background: "#f2f2f2"
                        }}
                        onPlay={()=>{
                            setCurrentTrack({...currentTrack,isPlaying: true})
                        }}
                        onPause={()=>{
                            setCurrentTrack({...currentTrack,isPlaying: false})
                        }}
                        />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                        minWidth: "100px"
                    }}>
                        <div style={{ color: "#ccc"}}>{currentTrack.description}</div>
                        <div style={{ color: "black"}}>{currentTrack.title}</div>
                    </div>
                </Container>
            </AppBar>
        </div>
    )
}

export default AppFooter;