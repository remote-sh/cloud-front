import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { useTokenStore } from "../store/tokenStore";
import { api } from "../utils/config";

export function VideoPlayer({
  folderKey,
  fileKey,
}: {
  folderKey: string;
  fileKey: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const url = `${api.cloud}/video/stream/${folderKey}/${fileKey}/master.m3u8`;
  const accessToken = useTokenStore.getState().accessToken;
  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        },
      });
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
    }
  }, [accessToken, url]);

  return (
    <video ref={videoRef} controls>
      <source src={url} />
    </video>
  );
}