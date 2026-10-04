import { useEffect, useState } from "react";
import LoadingToRedirect from "./loadingToRedirect";
import usefoodDelivery from "../globalState/fooddeliveryStore";

const ProtectRouteDelivery = ({ element }) => {
  const [ok, setOk] = useState(false);

  const user = usefoodDelivery((state) => state.user);
  const token = usefoodDelivery((state) => state.token);

  useEffect(() => {
    if (!user || !token) {
      setOk(false);
      return;
    }

    if (user.role === "DELIVERY") {
      setOk(true);
      return;
    }

    setOk(false);
  }, [user, token]);

  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRouteDelivery;