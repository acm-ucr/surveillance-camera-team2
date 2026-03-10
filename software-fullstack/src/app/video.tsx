"use client";
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import NightVision from './nightvision';

interface WebcamStreamerProps {
  nightVision: boolean;
  modelURL: string;
  remoteFrame?: string | null;
}

export interface WebcamStreamerHandle {
  takeScreenshot: () => void;
}

const WebcamStreamer = forwardRef<WebcamStreamerHandle, WebcamStreamerProps>(
  ({ nightVision, remoteFrame }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const formatTime = (d: Date) =>
      d.toLocaleTimeString("en-US", { hour12: false });
    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });

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
        if (nightVision) {
          ctx.filter = 'none'; // Reset filter fso scanlines aren't tinted
          for (let y = 0; y < canvas.height; y += 4) {
            ctx.fillStyle = `rgba(0, 0, 0, 0.15)`;
            ctx.fillRect(0, y + 2, canvas.width, 2);
          }
        }

        const now = new Date();
        const timestamp = now.toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];
        const timeStr = `${formatDate(now)} ${formatTime(now)}`;

        const fontSize = Math.round(canvas.width * 0.018);
        ctx.font = `${fontSize}px monospace`;

        const padding = Math.round(canvas.width * 0.02);
        const textWidth = ctx.measureText(timeStr).width;
        const boxHeight = fontSize * 2;
        const boxY = canvas.height - padding - boxHeight;

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        // Background for timestamp
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(22, 23, 43, 0.4)';
        ctx.beginPath();
        const boxX = canvas.width - textWidth - padding * 2;
        ctx.roundRect(boxX, boxY, textWidth + padding, boxHeight, 4);
        ctx.fill();

        // Text for timestamp
        ctx.fillStyle = isLight ? 'rgba(22, 23, 43, 1)' : 'rgba(255, 255, 255, 1)';
        ctx.fillText(timeStr, boxX + (padding / 2), boxY + (boxHeight * 0.65));

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
      <div className={`video-wrapper ${nightVision ? 'scanlines' : ''}`}>
        {remoteFrame ? (
          <img src={remoteFrame} alt="Remote feed" className="webcam-video" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="webcam-video"
          />
        )}
        <div className="timestamp">
          <span> {currentTime ? `${formatDate(currentTime)} ${formatTime(currentTime)}` : ''} </span>
        </div>
        <div className="rec">
          <span className="rec-dot" />
          <span className="rec-text">REC</span>
        </div>
      </div>
    </>
  );
  }
);

export default WebcamStreamer;

