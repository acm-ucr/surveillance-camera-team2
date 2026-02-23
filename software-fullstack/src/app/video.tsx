"use client";
import React, { useRef, useEffect } from 'react';

const WebcamStreamer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        // Request access to the video and audio devices
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        // Assign the stream to the video element's srcObject
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play(); // Start playing the video once metadata is loaded
          };
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        // Handle errors, e.g., if the user denies permission
        alert("Could not access the camera. Please check permissions.");
      }
    };

    startWebcam();

    // Cleanup function to stop the stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline // Important for mobile devices
        muted // Muted to avoid feedback loops if audio is enabled
        className="webcam-video"
      />
    </div>
  );
};

export default WebcamStreamer;