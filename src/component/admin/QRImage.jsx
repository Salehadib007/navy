import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRImage = ({ value }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(
      value,
      {
        width: "100%",
        scale: 10,
        margin: 4,
        errorCorrectionLevel: "H",
      },
      (err, url) => {
        if (!err) setSrc(url);
      },
    );
  }, [value]);

  if (!src) return <p>Generating QR...</p>;

  return <img src={src} alt="QR Code" />;
};

export default QRImage;
