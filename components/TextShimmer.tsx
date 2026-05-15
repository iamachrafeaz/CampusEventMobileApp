import React from "react";
import ShimmerText from "react-native-shimmer-text";



export default function TextShimmer({ text }: { text: string }) {


  return (
    <ShimmerText
      bold={false}
      size="md"
      duration={1}
      style={{
        textAlign: "left"
      }}
      colors={{
        light: {
          text: "#333333",
          shimmer: { start: "#919191", middle: "#000000", end: "#919191" },
        },
        dark: {
          text: "#cccccc",
          shimmer: { start: "#424242", middle: "#616161", end: "#424242" },
        },
      }}>
      {text}
    </ShimmerText>
  );
}
