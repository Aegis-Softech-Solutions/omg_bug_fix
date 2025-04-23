const withPlugins = require("next-compose-plugins");
const withOptimizedImages = require("next-optimized-images");
const withFonts = require("next-fonts");
const withVideos = require("next-videos");

const nextJsConfig = {
  env: {
    CLIENT_URL: "http://localhost:3000",
    // REACT_APP_HTTP_URL: "https://apiv2.omgfaceoftheyear.com/graphql",
    REACT_APP_HTTP_URL: "http://localhost:8080/graphql",
    REACT_APP_IMAGE_URL: "https://omg-erp.s3.ap-south-1.amazonaws.com/",
    REACT_APP_PROFILE_IMAGE_PATH: "customer-profile-pic/",
    REACT_APP_TOP_150_VIDEO_PATH: "top-150/",
    REACT_APP_TOP_75_VIDEO_PATH: "top-75/",
    REACT_APP_TOP_30_VIDEO_PATH: "top-30/",
    REACT_APP_TOP_20_VIDEO_PATH: "top-20/",
    REACT_APP_MISC_URL: "misc/",
    REACT_APP_LOGO_URL: "logo/",
    YOUTUBE_API_KEY: "AIzaSyAMyyUsWX2qcqzJq2nXGL1duC5GVdRgIB0",
    RAZORPAY_KEY: "rzp_test_CjT8RnMq6KtVdC",
    // RAZORPAY_KEY: "rzp_live_7sSEi6aS2AhciU",


    // CLIENT_URL: "https://omgfaceoftheyear.com/",
    // REACT_APP_HTTP_URL: "https://api.omgfaceoftheyear.com/graphql",
    // REACT_APP_IMAGE_URL: "https://api.omgfaceoftheyear.com/public/images/",
    // REACT_APP_PROFILE_IMAGE_PATH: "customer-profile-pic/",
    // REACT_APP_TOP_150_VIDEO_PATH: "top-150/",
    // REACT_APP_TOP_75_VIDEO_PATH: "top-75/",
    // REACT_APP_TOP_30_VIDEO_PATH: "top-30/",
    // REACT_APP_TOP_20_VIDEO_PATH: "top-20/",
    // REACT_APP_MISC_URL: "misc/",
    // REACT_APP_LOGO_URL: "logo/",
    // YOUTUBE_API_KEY: "AIzaSyAMyyUsWX2qcqzJq2nXGL1duC5GVdRgIB0",
    // RAZORPAY_KEY: "rzp_live_fMscclCs2vmaoC",
  },
};

module.exports = withPlugins([
  [
    withOptimizedImages,
    {
      mozjpeg: {
        quality: 90,
      },
      webp: {
        preset: "default",
        quality: 90,
      },
    },
  ],
  withFonts,
  nextJsConfig,
  withVideos,
]);
