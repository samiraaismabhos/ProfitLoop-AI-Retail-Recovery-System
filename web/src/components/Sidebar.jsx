import { useEffect, useState } from "react";

import logo from "../assets/logo.png";

import {
  LayoutDashboard,
  AlertTriangle,
  Brain,
  RefreshCcw,
  Megaphone,
  Leaf,
  Settings,
  Menu,
  LogOut,
  UserCircle2,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  // LOCAL STORAGE STATE
  const [open, setOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");

    return savedState ? JSON.parse(savedState) : false;
  });

  // SAVE STATE
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  // LOGOUT FUNCTION
  const handleLogout = () => {

    // token silmek isteyirsense
    localStorage.removeItem("token");

    // login sehifesine yonlendir
    navigate("/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={22} />,
    },

    {
      name: "Risk Monitor",
      path: "/risk-monitor",
      icon: <AlertTriangle size={22} />,
    },

    {
      name: "AI Analysis",
      path: "/ai-analysis",
      icon: <Brain size={22} />,
    },

    {
      name: "Redistribution",
      path: "/redistribution",
      icon: <RefreshCcw size={22} />,
    },

    {
      name: "Campaigns",
      path: "/campaigns",
      icon: <Megaphone size={22} />,
    },

    {
      name: "ESG Metrics",
      path: "/esg-metrics",
      icon: <Leaf size={22} />,
    },
    {
      name: "Execute",
      path: "/execute",
      icon: <Settings size={22} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={22} />,
    },

  ];

  return (
    <div
      className={`
        bg-[#0f172a]
        min-h-screen
        border-r border-[#1e293b]
        flex flex-col justify-between
        duration-300
        relative
        ${open ? "w-[260px]" : "w-[90px]"}
      `}
    >
      {/* TOP AREA */}
      <div className="p-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div
            className={`
              flex items-center
              ${open ? "gap-3" : "justify-center"}
            `}
          >

            {/* LOGO */}
            <div
              className="
                w-12 h-12
                bg-white
                rounded-2xl
                flex items-center justify-center
                overflow-hidden
                shrink-0
              "
            >

              <img
                src={logo}
                alt="logo"
                className="w-9 h-9 object-contain"
              />

            </div>

            {/* TEXT */}
            {open && (
              <div>

                <h1 className="text-white font-bold text-lg whitespace-nowrap">
                  BRAVO AI
                </h1>

                <p className="text-gray-400 text-sm whitespace-nowrap">
                  ProfitLoop AI
                </p>

              </div>
            )}

          </div>

          {/* TOGGLE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              text-white
              bg-[#1e293b]
              p-2
              rounded-xl
              hover:bg-green-500
              hover:text-black
              transition
              shrink-0
            "
          >
            <Menu size={20} />
          </button>

        </div>

        {/* MENUS */}
        <div className="mt-10 space-y-3">

          {menus.map((menu, index) => (

            <NavLink
              key={index}
              to={menu.path}
              className={({ isActive }) =>
                `
                  flex items-center
                  ${open ? "justify-start px-4" : "justify-center"}
                  gap-4
                  py-4
                  rounded-2xl
                  transition-all
                  ${
                    isActive
                      ? "bg-green-500 text-black"
                      : "text-gray-300 hover:bg-[#1e293b]"
                  }
                `
              }
            >

              {menu.icon}

              {open && (
                <span className="font-medium whitespace-nowrap">
                  {menu.name}
                </span>
              )}

            </NavLink>

          ))}

        </div>

      </div>

      {/* PROFILE */}
      <div className="p-4">

        <div
          className="
            bg-[#111827]
            border border-[#1f2937]
            rounded-2xl
            p-3
          "
        >

          <div
            className={`
              flex items-center
              ${open ? "justify-between" : "justify-center"}
            `}
          >

            {/* USER */}
            <div className="flex items-center gap-3">

              <div
                className="
                  bg-green-500
                  rounded-full
                  w-11 h-11
                  flex items-center justify-center
                  shrink-0
                "
              >
                <UserCircle2
                  size={24}
                  className="text-black"
                />
              </div>

              {open && (
                <div>

                  <h2 className="text-white font-semibold text-sm whitespace-nowrap">
                    Jamil Ahmadov
                  </h2>

                  <p className="text-gray-400 text-xs whitespace-nowrap">
                    System Admin
                  </p>

                </div>
              )}

            </div>

            {/* LOGOUT */}
            {open && (
              <button
                onClick={handleLogout}
                className="
                  text-gray-400
                  hover:text-red-400
                  transition
                "
              >
                <LogOut size={20} />
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Sidebar;