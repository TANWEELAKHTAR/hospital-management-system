// import React from "react";
// import { NavLink } from "react-router-dom";

// const Menu = () => {

//   return (
//     <div className="w-64 menu">
//       <div className="flex justify-between items-center border-b-2 border-gray-400 p-4 border-r-2">
//         <h1 className="text-lg font-bold">Reception</h1>
//         <button className="cursor-pointer">
//           <img
//             className="h-6 w-6 object-cover"
//             src="/images/close.svg"
//             alt=""
//           />
//         </button>
//       </div>
//       <div className="p-4 space-y-4 border-r-2 border-gray-400 h-full flex flex-col">
//         <NavLink
//           to={"new-patient-registration"}
//           className={({ isActive }) => isActive && "font-extrabold text-[#0D8E83]"}
//         >
//           New Patient Registration
//         </NavLink>
//         <NavLink
//           to={"patient-master"}
//           className={({ isActive }) => isActive && "font-extrabold text-[#0D8E83]"}
//         >
//           Patient Master
//         </NavLink>
//         <NavLink
//           to={"services"}
//           className={({ isActive }) => isActive && "font-extrabold text-[#0D8E83]"}
//         >
//           Services
//         </NavLink>
//         <NavLink
//           to={"referral"}
//           className={({ isActive }) => isActive && "font-extrabold text-[#0D8E83]"}
//         >
//           Referals
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Menu;

import React from "react";
import { NavLink } from "react-router-dom";
import { useMenu } from "../Context/MenuProvider";

const Menu = () => {
  const { activeMenu, isMenuVisible, toggleMenu } = useMenu();

  const handleClose = () => {
    toggleMenu(activeMenu);
  };

  if (!isMenuVisible) return null;

  const menuContents = {
    reception: (
      <>
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4 border-r-2">
          <h1 className="text-lg font-bold">Reception</h1>

          <button onClick={handleClose} className="cursor-pointer">
            <img
              className="h-6 w-6 object-cover"
              src="/images/close.svg"
              alt=""
            />
          </button>
        </div>
        <h1 className="text-lg font-bold"></h1>
        <div className="p-4 space-y-4 border-r-2 border-gray-400 h-full flex flex-col">
          <NavLink
            to={"new-patient-registration"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            New Patient Registration
          </NavLink>
          <NavLink
            to={"patient-master"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            Patient Master
          </NavLink>
          <NavLink
            to={"services"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            Services
          </NavLink>
          <NavLink
            to={"referral"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            Referrals
          </NavLink>
        </div>
      </>
    ),
    doctors: (
      <>
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4 border-r-2">
          <h1 className="text-lg font-bold">Doctors</h1>

          <button onClick={handleClose} className="cursor-pointer">
            <img
              className="h-6 w-6 object-cover"
              src="/images/close.svg"
              alt=""
            />
          </button>
        </div>
        <div className="p-4 space-y-4 border-r-2 border-gray-400 h-full flex flex-col">
          <NavLink
            to={"op-queue"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            OP Queue
          </NavLink>
          <NavLink
            to={"ip-dashboard"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            IP Dashboard
          </NavLink>
        </div>
      </>
    ),
    // Add more menu configurations as needed
    nurse: (
      <>
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4 border-r-2">
          <h1 className="text-lg font-bold">Nurse</h1>

          <button onClick={handleClose} className="cursor-pointer">
            <img
              className="h-6 w-6 object-cover"
              src="/images/close.svg"
              alt=""
            />
          </button>
        </div>
        <div className="p-4 space-y-4 border-r-2 border-gray-400 h-full flex flex-col">
          <NavLink
            to={"op-assessment"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            OP Assessment
          </NavLink>
          <NavLink
            to={"ip-care-management"}
            className={({ isActive }) =>
              isActive && "font-extrabold text-[#0D8E83]"
            }
          >
            IP care management
          </NavLink>
        </div>
      </>
    ),
  };

  return <div className="w-64 menu">{menuContents[activeMenu]}</div>;
};

export default Menu;
