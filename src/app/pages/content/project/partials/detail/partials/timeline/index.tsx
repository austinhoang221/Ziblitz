import { Empty, Table } from "antd";
import { Gantt, Task } from "gantt-task-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import { IssueService } from "../../../../../../../../services/issueService";
import { checkResponseStatus } from "../../../../../../../helpers";
import HeaderProject from "../header";
import "gantt-task-react/dist/index.css";
export default function TimelineProject() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      IssueService.getAll(project?.id!).then((res) => {
        if (checkResponseStatus(res)) {
          let data = res?.data?.filter((item) => item.start && item.end)!;
          data = data.map((item) => {
            return {
              ...item,
              start: new Date(item.start),
              end: new Date(item.end),
            };
          });
          setIsLoading(false);
          setTasks(sortTasksAndProjects(data));
        }
      });
    };
    if (project?.id) fetchData();
  }, [project?.id]);

  const sortTasksAndProjects = (data: any[]) => {
    // Separate projects and tasks
    const projects = data.filter((item) => item.type === "project");
    const tasks = data.filter((item) => item.type === "task");

    // Sort projects by start date
    projects.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // Create a map to store tasks by their parent project ID
    const tasksMap = tasks.reduce((map, task) => {
      const parentId = task.project;
      map[parentId] = map[parentId] || [];
      map[parentId].push(task);
      return map;
    }, {});

    // Flatten the result array with projects and their tasks
    const sortedData = projects.reduce((result, project) => {
      const parentId = project.id;
      result.push(project);
      if (tasksMap[parentId]) {
        result.push(...tasksMap[parentId]);
      }
      return result;
    }, []);

    return sortedData;
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleExpanderClick = (task: any) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  return (
    <>
      <HeaderProject
        title="Timeline"
        isFixedHeader={true}
        actionContent={<></>}
        onSearch={onSearch}
      ></HeaderProject>
      <div className="mt-4">
        {!isLoading ? (
          tasks?.length > 0 ? (
            <Gantt
              tasks={tasks}
              onExpanderClick={handleExpanderClick}
              ganttHeight={370}
            />
          ) : (
            <Empty></Empty>
          )
        ) : (
          <Table loading={true}></Table>
        )}
      </div>
    </>
  );
}
