import { useCallback, useEffect, useState } from "react";
import { UserService } from "../../services/userService";
import { checkResponseStatus } from "../helpers";
import { IUser } from "../models/IUser";

function useUserData(userId: string) {
    const [listUser, setListOfData] = useState<IUser[]>([]);
  
    const fetchData = useCallback(() => {
      UserService.getAllUser(
      ).then((res) => {
        if (checkResponseStatus(res)) {
          setListOfData(res?.data!);
        }
      });
    }, [userId]);
  
    useEffect(() => {
        fetchData();
      }, [fetchData, userId]);
    
      return { listUser };
    }
  
  export default useUserData;