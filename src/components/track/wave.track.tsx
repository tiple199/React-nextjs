'use client'
import { useSearchParams } from "next/navigation";
import { useEffect,useRef, useState, useMemo, useCallback } from "react";
import {useWavesurfer} from "@/utils/customHook";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import { Pause, PauseCircleOutline, PlayArrowOutlined, PlayArrowRounded, PlayCircleOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { sendRequest } from "@/utils/api";



const WaveTrack = ()=> {
    const [isPlaying,setIsPlaying] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const id = searchParams.get('id');
    const [trackInfo,setTrackInfo] = useState<ITrackTop | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const [time,setTime] = useState<string>("0:00");
    const [duration,setDuration] = useState<string>("0:00");
    const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> =>{
        let gradient,progressGradient;
        if(typeof window !== "undefined"){
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!;
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }

        return{
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 2,
            url: `/api?audio=${fileName}`,
            // renderFunction: (channels, ctx) => {
                
            
            // }
        }
    },[])
    

    const wavesurfer = useWavesurfer(containerRef,optionsMemo);
    
   
    useEffect(()=>{
        if(!wavesurfer) return;
        setIsPlaying(false);
        const hover = hoverRef.current!;
        const waveform = containerRef.current!;
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`));
        const subscriptions = [
            wavesurfer.on("play",()=>setIsPlaying(true)),
            wavesurfer.on("pause",()=>setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.on('interaction', () => {
                wavesurfer.play()
            })

        ];
        return ()=>{
            subscriptions.forEach((unsub) => unsub());
        }
    },[wavesurfer]);

    useEffect(()=>{
        const fetchData = async ()=>{
            const res= await sendRequest<IBackendRes<ITrackTop>>({
            url: `http://localhost:8000/api/v1/tracks/${id}`,
            method: "GET",
          });
          if(res && res.data) {
            setTrackInfo(res.data);
          }
        }
        fetchData();
    },[id])

    const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

    const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }
  const arrComments = [
    {
        id: 1, 
        avatar: "http://localhost:8000/images/chill1.png",
        moment: 10, 
        user: "username 1", 
        content: "just a comment1"
    },
    {
        id: 2, 
        avatar: "http://localhost:8000/images/chill1.png",
        moment: 30, 
        user: "username 2", 
        content: "just a comment3"
    },
    {
        id: 3, 
        avatar: "http://localhost:8000/images/chill1.png",
        moment: 50, 
        user: "username 3", 
        content: "just a comment3"
    },
];
    const calLeft = (moment: number) =>{
        const hardCodeDuration = 199;
        const percent = moment/hardCodeDuration*100
        return `${percent}%`
    }

    return(
        <div style={{marginTop: "20px",display: "flex",width:"100%"}}>
            <div className="track-item">
                <div ref={containerRef} className="wave-form-container" style={{width:"75%",marginLeft:15}}>
                    <div className="time" >{time}</div>
                    <div className="duration" >{duration}</div>
                    <div ref={hoverRef} className="hover-wave" id="hover"></div>
                </div>
                <div className="info-track">
                    <div className="info-track_btn" onClick={onPlayPause} 
                    style={{width: "50px",height: "50px",display: "flex",alignItems: "center",justifyContent: "center",cursor: "pointer",background: "#ff6000",borderRadius:"50%"}}
                    >
                        {isPlaying === true ? <Pause sx={{fontSize: 35  ,color:"white"}}/> : <PlayArrowRounded sx={{fontSize: 40,color:"white"}}/>}
                    </div>
                    <div>
                        <span className="info-track_title">{trackInfo?.title}</span>
                        <span className="info-track_author">{trackInfo?.description}</span>
                    </div>
                </div>
                <div className="img-wrap">
                    <img src="" alt="" className="img-track"/>
                </div>
                <div className="comments" style={{position:"relative",background: "red",width:"75%",marginLeft:15}}>

                    {
                        arrComments.map((v)=>(
                            <Tooltip title={v.content} arrow key={v.id}>

                            <img
                            // onPointerMove={(e)=>{
                            //     const hover = hoverRef.current!;
                            //     // hover.style.opacity = "1",
                            //     hover.style.width = calLeft(v.moment);
                            // }}
                            key={v.id} style={{width:"20px",height:"20px",position:"absolute",bottom:"5px",zIndex:20,
                                left: calLeft(v.moment)
                            }}
                            src={v.avatar} alt="" />
                            </Tooltip>
                        ))
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default WaveTrack;