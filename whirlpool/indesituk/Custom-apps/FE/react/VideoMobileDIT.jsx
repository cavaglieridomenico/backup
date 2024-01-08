import React, { useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import ReactPlayer from "react-player";
export default function VideoMobileDIT(videoURL) {
  const CSS_HANDLES = ["modalSpecialDoItTogether__videoFileMobile"];
  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <>
      <div className={handles.modalSpecialDoItTogether__videoFileMobile}>
        {/*  <iframe
          width="375"
          height="193"
          frameBorder="0"
          src={videoURL.videoURL}
        ></iframe> */}
        <ReactPlayer
          width='100%'
          height='100%'
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
        />
      </div>
    </>
  );
}
