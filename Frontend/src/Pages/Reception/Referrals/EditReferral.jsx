import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReferralForm from "../../../Components/ReferralForm";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { getReferral, editReferral } from "../../../api/receptionService";

const EditReferral = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referral, setReferral] = useState(null);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        setFetchLoading(true);
        const data = await getReferral(id);
        setReferral(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching referral:', err);
        setError('Failed to load referral details. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchReferral();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await editReferral(id, formData);
      console.log('Referral updated successfully:', response);

      // Show success toast
      toast.success("Referral updated successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        onClose: () => {
          // Navigate back to referrals list after toast closes
          navigate('/reception/referral');
        }
      });
    } catch (err) {
      console.error('Error updating referral:', err);
      setError(err.message || 'Failed to update referral. Please try again.');

      // Show error toast
      toast.error(err.message || 'Failed to update referral', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="w-full h-full flex bg-white flex-col">
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
          <div className="flex gap-2 items-center">
            <Link to="/reception/referral"><img src="/images/Back.svg" alt="Back" /></Link>
            <h1 className="text-lg font-bold">Edit Referral</h1>
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
            <h1 className="text-lg font-bold">Edit Referral</h1>
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
          <h1 className="text-lg font-bold">Edit Referral</h1>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/reception/view-referral/${id}`}
            className="bg-[#F0F2F5] border border-gray-400 px-4 py-0.5 text-sm rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="referral-form"
            disabled={loading}
            className={`cursor-pointer ${loading ? 'bg-gray-400' : 'bg-[#0D8E83]'} px-4 py-1 text-sm rounded-lg text-white flex items-center`}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Update
          </button>
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="light"
            transition={Bounce}
          />
        </div>
      </div>
      <div className="h-full p-4 bg-[#FDFDFE]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <ReferralForm
          id="referral-form"
          onSubmit={handleSubmit}
          loading={loading}
          initialData={referral}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

export default EditReferral;
