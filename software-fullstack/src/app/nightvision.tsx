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

        if (enabled) {
            video.style.filter = "brightness(1.8) contrast(1.4) saturate(0) sepia(1) hue-rotate(70deg)";
        } else {
            video.style.filter = "none";
        }
    }, [enabled, videoRef]);

    return null;
};

export default NightVision;
