import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRImage = ({ value }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(
      value,
      {
        width: 300,
        margin: 2,
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
