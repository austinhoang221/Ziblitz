import { useCallback, useEffect, useState } from "react";
import { RoleService } from "../../services/roleService";
import { checkResponseStatus } from "../helpers";
import { IRole } from "../models/IRole";

function useRoleData() {
    const [listRole, setListOfData] = useState<IRole[]>([]);
  
    const fetchData = useCallback(() => {
      RoleService.getAll(
      ).then((res) => {
        if (checkResponseStatus(res)) {
          setListOfData(res?.data!);
        }
      });
    }, []);

    const refreshData = () => {
      fetchData();
    };
  
    useEffect(() => {
        fetchData();
      }, [fetchData]);
    
      return { listRole, refreshData };
    }
  
  export default useRoleData;