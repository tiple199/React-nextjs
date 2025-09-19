'use client'
import { useSearchParams } from "next/navigation";
import { useEffect,useRef, useState, useMemo } from "react";
import {useWavesurfer} from "@/utils/customHook";



const WaveTrack = ()=> {
    const searchParams = useSearchParams()
    const optionsMemo = useMemo(()=>{
        return{
            waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: `/api?audio=${fileName}`,
        }
    },[])
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);

    const wavesurfer = useWavesurfer(containerRef,optionsMemo)



    return(
        <div ref={containerRef}>
            wave track
        </div>
    )
}

export default WaveTrack;