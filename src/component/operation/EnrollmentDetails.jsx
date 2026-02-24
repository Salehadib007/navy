import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api.js"; // your API utility
import { formatDate } from "../../../utils/formatDate";

const EnrollmentDetails = () => {
  const location = useLocation();
  const enrollmentId = location.state?.enrollmentId;
  // console.log(enrollmentId);
  // pass only ID when navigating
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch enrollment data from API
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!enrollmentId) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/enrollment/${enrollmentId}`);
        // console.log(data);

        setEnrollment(data[0]);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch enrollment data!");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [enrollmentId]);

  if (loading) return <p className="p-4">Loading enrollment...</p>;
  if (!enrollment) return <p className="p-4">Enrollment not found!</p>;

  const registrationParts = enrollment.registrationInfo
    ? enrollment.registrationInfo.split(".")
    : [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-10">
      <div className="w-full max-w-6xl mx-auto space-y-10">
        {/* PROFILE HEADER */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {enrollment.profileImage && (
            <img
              src={enrollment.profileImage}
              alt="Profile"
              className="w-48 h-48 object-contain border border-gray-200 rounded-2xl cursor-pointer"
              onClick={() => setSelectedImage(enrollment.profileImage)}
            />
          )}
          <div className="text-center md:text-left space-y-2 flex-1">
            <h1 className="text-3xl font-semibold text-gray-900">
              {enrollment.fullName}
            </h1>
            <p className="text-blue-600 font-medium">
              {enrollment.officialRank}
            </p>
            <p className="text-gray-500">PNO: {enrollment.pno}</p>
          </div>
        </div>

        {/* PERSONAL INFO */}
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

        {/* VEHICLE INFO */}
        <Section title="Vehicle Information">
          <Info label="Vehicle Type" value={enrollment.vehicleType} />
          <Info label="Vehicle Brand" value={enrollment.vehicleBrand} />
          <Info label="Vehicle Model" value={enrollment.vehicleModel} />
          <Info label="Registration Info" value={enrollment.registrationInfo} />
          <Info label="Location" value={registrationParts[0] || "-"} />
          <Info label="Unit" value={registrationParts[1] || "-"} />
          <Info label="Serial" value={registrationParts[2] || "-"} />
          <Info label="Year" value={registrationParts[3] || "-"} />
          <Info label="Registration No" value={enrollment.registrationNo} />
          <Info label="Chassis Number" value={enrollment.chassisNumber} />
          <Info label="Engine Number" value={enrollment.engineNumber} />
          <Info label="Issue Date" value={formatDate(enrollment.issueDate)} />
          <Info label="Validity" value={formatDate(enrollment.validity)} />
          <Info label="Fitness" value={formatDate(enrollment.fitness)} />
          <Info label="Sticker" value={enrollment.sticker} />
          <Info label="Tax Token" value={enrollment.taxToken} />

          {/* IMAGES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {enrollment.taxTokenImage && (
              <ImageCard
                title="Tax Token"
                src={enrollment.taxTokenImage}
                onClick={setSelectedImage}
              />
            )}
            {enrollment.fitnessImage && (
              <ImageCard
                title="Fitness"
                src={enrollment.fitnessImage}
                onClick={setSelectedImage}
              />
            )}
            {enrollment.stickerImage && (
              <ImageCard
                title="Sticker"
                src={enrollment.stickerImage}
                onClick={setSelectedImage}
              />
            )}
          </div>
        </Section>

        {/* DRIVER INFO */}
        <Section title="Driver Information">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {enrollment.driverImage && (
              <div className="flex-shrink-0 w-full md:w-64">
                <ImageCard
                  title="Driving License Image"
                  src={enrollment.driverImage}
                  onClick={setSelectedImage}
                />
              </div>
            )}
            <div className="w-full md:w-[300px] flex flex-col gap-4">
              <Info label="Driving Type" value={enrollment.drivingType} />
              <Info label="Driver Name" value={enrollment.driverName} />
              <Info label="Driver NID No" value={enrollment.driverNidNo} />
              <Info
                label="Driving License No"
                value={enrollment.drivingLicenseNo}
              />
              <Info
                label="License Expiry"
                value={formatDate(enrollment.licenseExpireDate)}
              />
            </div>
          </div>
        </Section>

        {/* DRIVER NID */}
        <Section title="Driver's NID">
          {enrollment.driverNidImage && (
            <div className="mt-6 w-full md:w-1/2">
              <ImageCard
                title="Driver NID"
                src={enrollment.driverNidImage}
                onClick={setSelectedImage}
              />
            </div>
          )}
        </Section>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default EnrollmentDetails;

/* Section wrapper */
const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
      {children}
    </div>
  </div>
);

/* Reusable Info & ImageCard components */
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

const ImageCard = ({ title, src, onClick }) => {
  if (!src) return null;
  return (
    <div className="space-y-2 cursor-pointer" onClick={() => onClick(src)}>
      <p className="text-xs uppercase text-gray-500 tracking-wide">{title}</p>
      <img
        src={src}
        alt={title}
        className="w-full h-48 object-contain border border-gray-200 rounded-2xl"
      />
    </div>
  );
};
