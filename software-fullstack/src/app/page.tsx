"use client"; /* runs in the browser */
import { useEffect, useState, useRef } from "react";
import WebcamStreamer, { WebcamStreamerHandle } from './video';

const Home = () => {
  const [nightVision, setNightVision] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const webcamRef = useRef<WebcamStreamerHandle>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", lightMode ? "light" : "dark");
  }, [lightMode]);

  return (
    <div className="page">
      <div className="top">
        <div className="titles">
          <h1 className="title">Forge Cam</h1>
          <h1 className="logo">ACM</h1>
        </div>
        <div className="buttons">
          <button className="night-vision" 
          onClick={() => setNightVision(v => !v)}>
            {nightVision ? "Night Vision: ON" : "Night Vision: OFF"}</button>
          <button className="screenshot" onClick = {() => webcamRef.current?.takeScreenshot()}>
            Screenshot</button>
          <button className="mode" onClick={() => setLightMode(v => !v)}>
            {lightMode ? "Dark Mode" : "Light Mode"}</button>
        </div>
      </div>
      <div className="main">
        <div className="camDisplay">
          <WebcamStreamer ref={webcamRef} nightVision={nightVision}/>
        </div>
        <div className="detections">
          <h2>Detection Logs</h2>
        </div>
      </div>
      
    {/*features to add: 
    --live time/date feature
    --better background?*/}
    </div>
  );
};

export default Home;
