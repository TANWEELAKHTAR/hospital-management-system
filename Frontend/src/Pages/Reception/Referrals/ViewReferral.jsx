import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getReferral } from '../../../api/receptionService';

const ViewReferral = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        setLoading(true);
        const data = await getReferral(id);
        setReferral(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching referral:', err);
        setError('Failed to load referral details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReferral();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex bg-white flex-col">
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
          <div className="flex gap-2 items-center">
            <Link to="/reception/referral"><img src="/images/Back.svg" alt="Back" /></Link>
            <h1 className="text-lg font-bold">View Referral</h1>
          </div>
        </div>
        <div className="h-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D8E83]"></div>
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="w-full h-full flex bg-white flex-col">
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
          <div className="flex gap-2 items-center">
            <Link to="/reception/referral"><img src="/images/Back.svg" alt="Back" /></Link>
            <h1 className="text-lg font-bold">View Referral</h1>
          </div>
        </div>
        <div className="h-full p-4 bg-[#FDFDFE] flex flex-col items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error || 'Referral not found'}</span>
          </div>
          <Link to="/reception/referral" className="mt-4 px-4 py-2 bg-[#0D8E83] text-white rounded-lg">
            Back to Referrals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <div className="flex gap-2 items-center">
          <Link to="/reception/referral"><img src="/images/Back.svg" alt="Back" /></Link>
          <h1 className="text-lg font-bold">View Referral</h1>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/reception/edit-referral/${id}`}
            className="bg-[#DEFCFA] border border-[#0D8E83] text-[#0D8E83] px-4 py-1 text-sm rounded-lg"
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="h-full p-4 bg-[#FDFDFE] overflow-auto">
        <div className="max-w-7xl w-full mx-auto">
          <div className="border border-[#D0D5DD] rounded-lg p-6 bg-white shadow-sm mb-6">
            <h2 className="text-gray-700 font-medium uppercase text-sm mb-4">Referral Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{referral.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Referral Type</p>
                <p className="font-medium">{referral.referralType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Referral Code</p>
                <p className="font-medium">{referral.referralCode}</p>
              </div>
              {referral.speciality && (
                <div>
                  <p className="text-sm text-gray-500">Speciality</p>
                  <p className="font-medium">{referral.speciality}</p>
                </div>
              )}
              {referral.qualification && (
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-medium">{referral.qualification}</p>
                </div>
              )}
              {referral.hospitalName && (
                <div>
                  <p className="text-sm text-gray-500">Hospital/Clinic Name</p>
                  <p className="font-medium">{referral.hospitalName}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border border-[#D0D5DD] rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-gray-700 font-medium uppercase text-sm mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{referral.address}</p>
              </div>
              {referral.city && (
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{referral.city}</p>
                </div>
              )}
              {referral.state && (
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{referral.state}</p>
                </div>
              )}
              {referral.pinCode && (
                <div>
                  <p className="text-sm text-gray-500">Pin Code</p>
                  <p className="font-medium">{referral.pinCode}</p>
                </div>
              )}
              {referral.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{referral.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{referral.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReferral;