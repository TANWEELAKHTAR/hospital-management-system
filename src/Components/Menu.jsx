import React from "react";
import { NavLink } from "react-router-dom";

const Menu = () => {
  const handelclose = () => {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("hidden");
  };

  return (
    <div className="w-64 menu">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4 border-r-2">
        <h1 className="text-lg font-bold">Reception</h1>
        <button onClick={handelclose} className="cursor-pointer">
          <img
            className="h-6 w-6 object-cover"
            src="/images/close.svg"
            alt=""
          />
        </button>
      </div>
      <div className="p-4 space-y-4 border-r-2 border-gray-400 h-full flex flex-col">
        <NavLink
          to={"new-patient"}
          className={({ isActive }) => isActive && "font-extrabold text-green-600"} // Will Only Apply NavLink Styles When the pathname matches the string in the "to" prop
        >
          New Patient Registration
        </NavLink>
        <NavLink
          to={"patient-master"}
          className={({ isActive }) => isActive && "font-extrabold text-green-600"}
        >
          Patient Master
        </NavLink>
        <NavLink
          to={"services"}
          className={({ isActive }) => isActive && "font-extrabold text-green-600"}
        >
          Services
        </NavLink>
        <NavLink
          to={"referral"}
          className={({ isActive }) => isActive && "font-extrabold text-green-600"}
        >
          Referals
        </NavLink>
      </div>
    </div>
  );
};

export default Menu;

{
  /* <li className='active:text-[#0D8E83] active:font-semibold'> */
}
