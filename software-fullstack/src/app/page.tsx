import "./page.css";
import WebcamStreamer from './video';

const Home = () => {

  return <>
    <title>ACM Forge Camera</title>

    {/* banner */}
    <div className="top">
      <h1 className="title">Forge Cam</h1>
      <h1 className="logo">ACM</h1>
    </div>

    {/* body */}
    <div className="main">
      <div className="camDisplay">
        <WebcamStreamer/>
      </div>

    {/* <div className="detection">

    </div> */}
    </div>

    {/* features to add:
    screenshot button
    night vision */}

    </>;
};

export default Home;
