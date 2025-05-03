import { NavLink, useNavigate } from "react-router-dom";
import { useMenu } from "../Context/MenuProvider";
import { useAuth } from "../Context/AuthContext";
import Menu from "./Menu";

const SideNav = () => {
  const { toggleMenu } = useMenu();
  const { userRole, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full">
      <div className="bg-[#06413C] w-20 px-2 flex flex-col justify-between text-white">
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="logo">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive && "font-extrabold text-[#0D8E83]"
              }
            >
              <img
                className="w-12 h-10 object-cover"
                src="/images/logo.svg"
                alt="Hospital Logo"
              />
            </NavLink>
          </div>
          <div className="flex flex-col items-center gap-4">
            {/* Admin Icon - visible to all */}
            <NavLink
              to={""}
              onClick={() => toggleMenu("")}
              className={({ isActive }) =>
                isActive ? "font-extrabold text-[#0D8E83]" : ""
              }
            >
              <img
                className="w-8 h-8 object-cover"
                src="images/sheild.svg"
                alt="Admin"
              />
            </NavLink>

            {/* Reception Icon - visible to reception and clinicAdmin */}
            {hasRole(['reception', 'clinicAdmin']) && (
              <NavLink
                to={"/reception"}
                onClick={() => toggleMenu("reception")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-8 h-8 object-cover"
                  src="images/person-add.svg"
                  alt="Reception"
                />
              </NavLink>
            )}

            {/* Doctor Icon - visible to doctor and clinicAdmin */}
            {hasRole(['doctor', 'clinicAdmin']) && (
              <NavLink
                to={"/doctor"}
                onClick={() => toggleMenu("doctors")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-8 h-8 object-cover"
                  src="images/stethoscope.svg"
                  alt="Doctor"
                />
              </NavLink>
            )}

            {/* Lab Icon - visible to lab and clinicAdmin */}
            {hasRole(['lab', 'clinicAdmin']) && (
              <NavLink
                to={"/lab"}
                onClick={() => toggleMenu("lab")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-8 h-8 object-cover"
                  src="images/biotech.svg"
                  alt="Lab"
                />
              </NavLink>
            )}

            {/* Inventory Icon - visible to inventory and clinicAdmin */}
            {hasRole(['inventory', 'clinicAdmin']) && (
              <NavLink
                to={"/inventory"}
                onClick={() => toggleMenu("inventory")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-8 h-8 object-cover"
                  src="images/home_storage.svg"
                  alt="Inventory"
                />
              </NavLink>
            )}

            {/* Pharmacy Icon - visible to pharmacy and clinicAdmin */}
            {hasRole(['pharmacy', 'clinicAdmin']) && (
              <NavLink
                to={""}
                onClick={() => toggleMenu("")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-8 h-8 object-cover"
                  src="images/cap.svg"
                  alt="Pharmacy"
                />
              </NavLink>
            )}

            {/* Nurse Icon - visible to nurse and clinicAdmin */}
            {hasRole(['nurse', 'clinicAdmin']) && (
              <NavLink
                to={"/nurse"}
                onClick={() => toggleMenu("nurse")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-7 h-7 object-cover"
                  src="images/nurse.svg"
                  alt="Nurse"
                />
              </NavLink>
            )}

            {/* Billing Icon - visible to billing and clinicAdmin */}
            {hasRole(['billing', 'clinicAdmin']) && (
              <NavLink
                to={"/"}
                onClick={() => toggleMenu("")}
                className={({ isActive }) =>
                  isActive ? "font-extrabold text-[#0D8E83]" : ""
                }
              >
                <img
                  className="w-8 h-8 object-cover"
                  src="images/receipt.svg"
                  alt="Billing"
                />
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mb-6 gap-4 cursor-pointer">
          {/* Settings - visible to clinicAdmin only */}
          {hasRole(['clinicAdmin']) && (
            <NavLink
              to={"/"}
              onClick={() => toggleMenu("")}
              className={({ isActive }) =>
                isActive ? "font-extrabold text-[#0D8E83]" : ""
              }
            >
              <img
                className="w-8 h-8 object-cover"
                src="/images/settings.svg"
                alt="Settings"
              />
            </NavLink>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="focus:outline-none cursor-pointer"
          >
            <img
              className="w-8 h-8 object-cover"
              src="/images/log-out.svg"
              alt="Logout"
            />
          </button>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default SideNav;
