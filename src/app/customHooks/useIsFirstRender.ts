import React from "react";

const useIsFirstRender = (): boolean => {
  const isFirst = React.useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};

export { useIsFirstRender };
