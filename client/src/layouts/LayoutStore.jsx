import { Outlet } from "react-router-dom";
import StoreNav from "../components/nav/StoreNav";
import StoreNavigation from "../components/nav/StoreNavigation";




const LayoutStore = () => {
 return (
    <>
    <StoreNav/>
    <Outlet />

    <StoreNavigation/>
    </>
  );
}
export default LayoutStore