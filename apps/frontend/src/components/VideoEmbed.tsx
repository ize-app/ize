import Box from "@mui/material/Box";

const VideoEmbed = () => {
  return (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "56.25%", // 16:9 Aspect Ratio
        height: 0,
      }}
    >
      <iframe
        src="https://player.vimeo.com/video/1056860875?badge=0&autopause=0&player_id=0&app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen;"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        title="Ize demo"
      />
    </Box>
  );
};

export default VideoEmbed;
