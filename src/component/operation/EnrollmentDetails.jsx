import React from "react";
import { useLocation } from "react-router-dom";

const EnrollmentDetails = () => {
  const location = useLocation();
  const enrollment = location.state?.enrollment[0];
  console.log(enrollment);

  if (!enrollment) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ================= HEADER ================= */}
        <div className="text-right mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 border border-black font-semibold hover:bg-black hover:text-white transition"
          >
            Print / Save as PDF
          </button>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={enrollment.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-2xl object-cover border border-gray-200"
          />

          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-semibold text-gray-900">
              {enrollment.fullName}
            </h1>
            <p className="text-blue-600 font-medium">
              {enrollment.officialRank}
            </p>
            <p className="text-sm text-gray-500">PNO: {enrollment.pno}</p>
          </div>
        </div>

        {/* ================= PERSONAL INFO ================= */}
        <Section title="Personal Information">
          <Info label="BR No / NID" value={enrollment.brNoOrNid} />
          <Info label="User Category" value={enrollment.userCategory} />
          <Info label="Blood Group" value={enrollment.bloodGroup} />
          <Info label="Primary Mobile" value={enrollment.primaryMobile} />
          <Info
            label="Alternative Mobile"
            value={enrollment.alternativeMobile}
          />
          <Info label="Email" value={enrollment.email} />
          <Info label="Job Location" value={enrollment.jobLocation} />
          <Info label="Permanent Address" value={enrollment.permanentAddress} />
        </Section>

        {/* ================= VEHICLE INFO ================= */}
        <Section title="Vehicle Information">
          <Info label="Vehicle Type" value={enrollment.vehicleType} />
          <Info label="Vehicle Brand" value={enrollment.vehicleBrand} />
          <Info label="Vehicle Model" value={enrollment.vehicleModel} />
          <Info label="Registration Info" value={enrollment.registrationInfo} />
          <Info label="Registration No" value={enrollment.registrationNo} />
          <Info label="Issue Date" value={enrollment.issueDate} />
          <Info label="Chassis Number" value={enrollment.chassisNumber} />
          <Info label="Engine Number" value={enrollment.engineNumber} />
          <Info label="Validity" value={enrollment.validity} />
          <Info label="Fitness" value={enrollment.fitness} />
          <Info label="Sticker" value={enrollment.sticker} />
          <Info label="Tax Token" value={enrollment.taxToken} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <ImageCard title="Tax Token" src={enrollment.taxTokenImage} />
            <ImageCard title="Fitness" src={enrollment.fitnessImage} />
            <ImageCard title="Sticker" src={enrollment.stickerImage} />
          </div>
        </Section>

        {/* ================= DRIVER INFO ================= */}
        <Section title="Driver Information">
          <div className="flex flex-col lg:flex-row gap-10 mb-8">
            <img
              src={enrollment.driverImage}
              alt="Driver"
              className="w-40 h-40 rounded-2xl object-cover border border-gray-200"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              <Info label="Driving Type" value={enrollment.drivingType} />
              <Info label="Driver Name" value={enrollment.driverName} />
              <Info label="Driver NID" value={enrollment.driverNidNo} />
              <Info
                label="Driving License No"
                value={enrollment.drivingLicenseNo}
              />
              <Info
                label="License Expiry"
                value={enrollment.licenseExpireDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ImageCard title="Driver NID" src={enrollment.driverNidImage} />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default EnrollmentDetails;

/* ================= Section Wrapper ================= */

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-8">{title}</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
      {children}
    </div>
  </div>
);

/* ================= Reusable Components ================= */

const Info = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-gray-500 text-xs uppercase tracking-wide">
      {label}
    </span>
    <span className="text-gray-900 font-medium break-words">
      {value || "-"}
    </span>
  </div>
);

const ImageCard = ({ title, src }) => {
  if (!src) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase text-gray-500 tracking-wide">{title}</p>
      <img
        src={src}
        alt={title}
        className="rounded-2xl object-cover h-36 w-full border border-gray-200 transition hover:shadow-md"
      />
    </div>
  );
};
