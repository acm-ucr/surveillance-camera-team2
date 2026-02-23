import "./styles.css";
import WebcamStreamer from './video';
export const metadata = {
  title: "ACM Forge Camera",
};

const Home = () => {
  return (
    <div className="page">
      <div className="top">
        <div className="titles">
          <h1 className="title">Forge Cam</h1>
          <h1 className="logo">ACM</h1>
        </div>
        <div className="buttons">
          <button className="night-vision">Night Vision</button>
          <button className="screenshot">Screenshot</button>
          <button className="mode">Light Mode</button>
        </div>
      </div>

      <div className="main">
        <div className="camDisplay">
          <WebcamStreamer/>
        </div>
      </div>
    </div>
  
    // features to add:
    // live time/date feature
    
  );
};

export default Home;
