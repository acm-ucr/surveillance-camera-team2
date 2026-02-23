"use client";
import { useEffect, useRef} from "react";

interface NightVisionProps {
    enabled: boolean;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

const NightVision = ({ enabled, videoRef }: NightVisionProps) => {
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateWrapperSize = () => {
            const wrapper = video.parentElement;
            if (!wrapper) return;

            const videoAspect = video.videoWidth / video.videoHeight;
            const containerAspect = wrapper.clientWidth / wrapper.clientHeight;

            let renderWidth, renderHeight;

            if (videoAspect > containerAspect) {
                renderWidth = video.clientWidth;
                renderHeight = video.clientWidth / videoAspect;
            } else {
                renderWidth = video.clientHeight * videoAspect;
                renderHeight = video.clientHeight;
            }

            wrapper.style.width = `${renderWidth}px`;
            wrapper.style.height = `${renderHeight}px`;
        }

        if (enabled) {
            video.style.filter = "brightness(1.8) contrast(1.4) saturate(0) sepia(1) hue-rotate(70deg)";
            video.classList.add("scanlines");
            video.addEventListener('loadedmetadata', updateWrapperSize);
            updateWrapperSize();
        } else {
            video.style.filter = "none";
            video.classList.remove("scanlines");
            const wrapper = video.parentElement;
            if (wrapper) {
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
            }
        }

        return () => {
            video.removeEventListener('loadedmetadata', updateWrapperSize);
        };
    }, [enabled, videoRef]);

    return null;
};

export default NightVision;
