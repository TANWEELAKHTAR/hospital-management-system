import { useState } from "react";
import { Link } from "react-router-dom";
import PatientTable from "../../Components/PatientTable";
import BillingTable from "../../Components/Billing/BillingTable";


const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mrnSearch,setMrnSearch ] = useState("");
  const [patientType, setPatientType] = useState("outpatient");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleMrnSearch = (e) => {
    setMrnSearch(e.target.value);
  };
  

  return (
    <div className="w-full h-full flex bg-white flex-col">
      
      <div className="flex gap-4 p-4 text-gray-500 font-medium">
        <h3
          className={`text-base cursor-pointer ${patientType === 'outpatient' ? 'border-b-2 border-[#0D8E83] text-[#0D8E83]' : ''}`}
          onClick={() => setPatientType('outpatient')}
        >
          IP Billing
        </h3>
       
      </div>
      <div className="bg-gray-100 p-4 flex flex-col gap-6 h-full">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="search flex items-center border-2 border-gray-400 px-3 py-1 rounded-lg bg-white">
              <input
                type="text"
                placeholder="Search by name"
                className="w-60 outline-0 p-1"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="cursor-pointer">
                <img
                  className="w-5 h-4 object-cover"
                  src="/images/search icon.svg"
                  alt="Search"
                />
              </button>
            </div>
            <div className="search flex items-center border-2 border-gray-400 px-3 py-1 rounded-lg bg-white">
              <input
                type="text"
                placeholder="Search by MRN"
                className="w-60 outline-0 p-1"
                value={mrnSearch}
                onChange={handleMrnSearch}
              />
              <button className="cursor-pointer">
                <img
                  className="w-5 h-4 object-cover"
                  src="/images/search icon.svg"
                  alt="Search"
                />
              </button>
            </div>
            
            <button className="flex items-center border-2 px-3 py-1 border-gray-400 rounded-lg gap-1 font-semibold cursor-pointer">
              <img
                className="w-5 h-4 object-cover"
                src="/images/Leading icon.svg"
                alt="Filter"
              />
              Filter
            </button>
          </div>
        </div>
        <BillingTable/>
      </div>
    </div>
  );
};

export default Billing;
