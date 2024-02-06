// controller.js
import useVideoModel from './model';

const useVideoController = () => {
  const {
    videos,
    currentVideoIndex,
    currentTime,
    isPlaying,
    videoRef,
    fetchAllVideos,
    handleVideoChange,
    handleTimeUpdate,
    getCurrentTime,
    handlePlay,
    handlePause,
    savePlaybackPosition,
  } = useVideoModel();

  return {
    videos,
    currentVideoIndex,
    currentTime,
    isPlaying,
    videoRef,
    fetchAllVideos,
    handleVideoChange,
    handleTimeUpdate,
    getCurrentTime,
    handlePlay,
    handlePause,
    savePlaybackPosition,
  };
};

export default useVideoController;
