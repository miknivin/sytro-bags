"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/userApi.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setIsAuthenticated } from "@/redux/features/userSlice";
const accountLinks = [
  { href: "/my-account", label: "Dashboard" },
  { href: "/my-account-orders", label: "Orders" },
  // { href: "/my-account-address", label: "Addresses" },
  { href: "/my-account-edit", label: "Account Details" },
];

export default function DashboardNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const { refetch,isLoading:userLoading } = useGetMeQuery();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("insidee")
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout().unwrap(); // ✅ Logs out the user
      await refetch(); // ✅ Refetch user data after logout to update state
      router.push("/"); // ✅ Redirect to home
      dispatch(setIsAuthenticated(false));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const pathname = usePathname();

  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          className="my-account-nav-item"
          disabled={isLoading} // ✅ Disable button while logging out
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </li>
    </ul>
  );
}
