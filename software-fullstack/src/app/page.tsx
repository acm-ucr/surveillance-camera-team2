"use client";
import { useState } from "react";
import WebcamStreamer from './video';

const Home = () => {
  const [nightVision, setNightVision] = useState(false);
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
          <button className="screenshot">Screenshot</button>
          <button className="mode">Light Mode</button>
        </div>
      </div>

      <div className="main">
        <div className="camDisplay">
          <WebcamStreamer nightVision={nightVision}/>
        </div>
      </div>
    {/*features to add: 
    --live time/date feature*/}
    </div>
  );
};

export default Home;
