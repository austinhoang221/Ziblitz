import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";

import HeaderProject from "../header";
const App: React.FC = () => {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  return (
    <>
      <HeaderProject></HeaderProject>
    </>
  );
};

export default App;
