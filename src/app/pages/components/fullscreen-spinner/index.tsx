import { Spin } from "antd";

export const FullScreenSpinner = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
      }}
    >
      <Spin size="large" />
    </div>
  );
};
