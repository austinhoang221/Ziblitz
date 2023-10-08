import { useCallback, useEffect, useState } from "react";
import { UserService } from "../../services/userService";
import { checkResponseStatus } from "../helpers";
import { IUser } from "../models/IUser";

function useUserData(userId: string, name?: string) {
    const [listUser, setListOfData] = useState<IUser[]>([]);
  
    const fetchData = useCallback(() => {
      UserService.getAllUser(name
      ).then((res) => {
        if (checkResponseStatus(res)) {
          setListOfData(res?.data!);
        }
      });
    }, [userId, name]);

    const refreshData = () => {
      fetchData();
    };
  
    useEffect(() => {
        fetchData();
      }, [fetchData, userId, name]);
    
      return { listUser, refreshData };
    }
  
  export default useUserData;