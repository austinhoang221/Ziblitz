import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../../redux/store";

export const PrivateRoute = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;

  const isLoggedIn: boolean = false;
  const location = useLocation();

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/login"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
};
