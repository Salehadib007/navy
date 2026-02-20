import { useLocation } from "react-router-dom";

export default function VehicleDetails() {
  const location = useLocation();
  const vehicle = location?.state;
  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No vehicle data found.</p>
      </div>
    );
  }

  const {
    vehicleType,
    vehicleBrand,
    registrationNo,
    registrationInfo,
    chassisNumber,
    engineNumber,
    sticker,
    taxToken,
    fitness,
    issueDate,
    licenseExpireDate,
    validity,
    taxTokenImage,
    fitnessImage,
    stickerImage,
  } = vehicle;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-3">
          Vehicle Details
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Vehicle Type" value={vehicleType} />
          <Info label="Vehicle Brand" value={vehicleBrand} />
          <Info label="Registration No" value={registrationNo} />
          <Info label="Registration Info" value={registrationInfo} />
          <Info label="Chassis Number" value={chassisNumber} />
          <Info label="Engine Number" value={engineNumber} />
          <Info label="Sticker" value={sticker} />
          <Info label="Tax Token Date" value={taxToken} />
          <Info label="Fitness Date" value={fitness} />
          <Info label="Issue Date" value={issueDate} />
          <Info label="License Expiry" value={licenseExpireDate} />
          <Info label="Validity" value={validity} />
        </div>

        {/* Images Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImageCard title="Tax Token" src={taxTokenImage} />
          <ImageCard title="Fitness Image" src={fitnessImage} />
          <ImageCard title="Sticker Image" src={stickerImage} />
        </div>
      </div>
    </div>
  );
}

/* Info Component */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium break-words">
        {value || <span className="text-slate-400">N/A</span>}
      </p>
    </div>
  );
}

/* Image Card */
function ImageCard({ title, src }) {
  if (!src) return null;

  return (
    <div>
      <p className="text-sm text-slate-500 mb-2">{title}</p>
      <img
        src={src}
        alt={title}
        className="w-full h-48 object-cover rounded-lg border"
      />
    </div>
  );
}
