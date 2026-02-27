import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRImage = ({ value }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: 300, // must be a number
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => setSrc(url))
      .catch((err) => console.error(err));
  }, [value]);

  if (!src) return <p>Generating QR...</p>;

  return (
    <img src={src} alt="QR Code" style={{ width: "100%", maxWidth: "300px" }} />
  );
};

export default QRImage;
