import { useCallback, useEffect, useState } from "react";
import { UserService } from "../../services/userService";
import { checkResponseStatus } from "../helpers";
import { IUser } from "../models/IUser";

function useUserData(userId: string, name?: string) {
  const [listUser, setListOfData] = useState<IUser[]>([]);
  const [isLoadingUser, setisLoadingUser] = useState(true);
  const fetchData = useCallback(async () => {
    setisLoadingUser(true);
    await UserService.getAllUser(name).then((res) => {
      if (checkResponseStatus(res)) {
        setListOfData(res?.data!);
      }
      setisLoadingUser(false);
    });
  }, [userId, name]);

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, userId, name]);

  return { listUser, isLoadingUser, refreshData };
}

export default useUserData;
