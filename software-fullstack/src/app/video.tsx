"use client";
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import NightVision from './nightvision';

interface WebcamStreamerProps {
  nightVision: boolean;
}

export interface WebcamStreamerHandle {
  takeScreenshot: () => void;
}

const WebcamStreamer = forwardRef<WebcamStreamerHandle, WebcamStreamerProps>(
  ({ nightVision }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
      takeScreenshot() {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (nightVision) {
          ctx.filter = 'brightness(1.8) contrast(1.4) saturate(0) sepia(1) hue-rotate(70deg)';
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const now = new Date();
        const timestamp = now.toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];

        const link = document.createElement('a');
        link.download = `forge-cam-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
  }));

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
    <>
      <NightVision enabled={nightVision} videoRef={videoRef} />
      <video
        ref={videoRef}
        autoPlay
        playsInline // Important for mobile devices
        muted // Muted to avoid feedback loops if audio is enabled
        className="webcam-video"
      />
    </>
  );
  }
);

export default WebcamStreamer;