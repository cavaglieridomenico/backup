import React, { useState,useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import ReactPlayer from "react-player";


export default function VideoMobileDIT(videoURL) {
  const CSS_HANDLES = ["modalSpecialDoItTogether__videoFileMobile"];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [tracked,setTracked]=useState(false)
  const [isPaused,setIsPaused]=useState(false)
  const [isSeeking,setIsSeeking]=useState(false)
  const [isSec,setIsSec]=useState("")

  useEffect(() => {
    setIsPaused(false);
    setTracked(false)
   
  }, [isSeeking])

  useEffect(() => {
    analyticsCallBack();
  }, [])

  const analyticsCallBack=()=>{

    let idVideo=videoURL.videoURL
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
  
    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel:  `Product Experience Video - ${videoURL.videoURL?idVideo:""}`,
    }
    window.dataLayer.push(analyticsJson);
  }
   // ON PLAY
   const analyticsCallBackPLAY=()=>{
    let idVideo= videoURL.videoURL
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
    if(!isSeeking){
      window.dataLayer = window.dataLayer || [];
      let analyticsJson = {
        event: "thronVideo",
        eventCategory: "Product Experience",
        eventLabel: "Product Experience Video - " + idVideo,
        eventAction: "View a Video - Play",
      }
      window.dataLayer.push(analyticsJson);
    }
  }

  // ON PAUSE
  const analyticsCallBackPAUSE=()=>{
    let idVideo= videoURL.videoURL
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
    
    if(!isSeeking){
      window.dataLayer = window.dataLayer || [];
      let analyticsJson = {
        event: "thronVideo",
        eventCategory: "Product Experience",
        eventLabel: "Product Experience Video - " + idVideo,
        eventAction: "View a Video - Stop",
      }
      window.dataLayer.push(analyticsJson);
    }
  }
  // ON END
  const analyticsCallBackEND=()=>{

    let idVideo= videoURL.videoURL
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
  
    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventCategory: "Product Experience",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video - Complete",
    }
    window.dataLayer.push(analyticsJson);
  }
  // ON SEEK
  const analyticsCallBackSEEK=(sec)=>{
    let idVideo= videoURL.videoURL
    .split("vi-")[1]

    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video - Seeked to sec " + Math.round(sec),
    }
    window.dataLayer.push(analyticsJson);
    setIsSeeking(false)
    
  }
  //ON 10 SECS
  const  analyticsCallBack10secs=()=>{
    let idVideo= videoURL.videoURL
    .split("vi-")[1]

    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video -" + Math.round(isSec)+"secs",
    }
    window.dataLayer.push(analyticsJson);
  }
  


  return (
    <>
      <div className={handles.modalSpecialDoItTogether__videoFileMobile}>
        <ReactPlayer
        id="thronVideo"
        width="375"
        height="193"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ overflow: "hidden" }}
        url={videoURL.videoURL}
        playing={true}
        controls={true}
        loop={false}
        config={{
          file: {
            attributes: {
              disablepictureinpicture: "true",
              controlsList: "nodownload",
            },
          },
        }}
        onPlay={() => {
          setTracked(true);
          if(!isSeeking){
            analyticsCallBackPLAY();
          }}
        }
        onPause={() =>{
          setIsPaused(true) 
            if(!isSeeking){
              analyticsCallBackPAUSE();
            }
          }
        }
        onEnded={() => analyticsCallBackEND()}
        onSeek={(e) =>{
          setIsSeeking(true);
          analyticsCallBackSEEK(e);
          }
        }
        onProgress={(e)=>{
          setIsSec(Math.round(e.playedSeconds));
          if(isSec===10){
            analyticsCallBack10secs()
          }
        }}      
        />
    </div>
    </>
  );
}
