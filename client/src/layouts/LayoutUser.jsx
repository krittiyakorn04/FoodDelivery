import { Outlet } from "react-router-dom";
import MainNav from "../components/nav/MainNav";
import UserNavigation from "../components/nav/UserNavigation";


const LayoutUser = () => {
  return (
    <>
      <MainNav />
      <Outlet />
      <UserNavigation/>
    </>
  );
};
export default LayoutUser;
