import { useCallback, useEffect, useState } from "react";
import { VersionService } from "../../services/versionService";
import { checkResponseStatus } from "../helpers";
import { IVersion } from "../models/IVersion";

function useVersionData(projectId: string) {
  const [listVersion, setListOfData] = useState<IVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = useCallback(async () => {
    if (projectId) {
      setIsLoading(true);
      await VersionService.getAll(projectId).then((res) => {
        if (checkResponseStatus(res)) {
          setListOfData(res?.data!);
        }
        setIsLoading(false);
      });
    }
  }, [projectId]);

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, projectId]);

  return { listVersion, isLoading, refreshData };
}

export default useVersionData;
