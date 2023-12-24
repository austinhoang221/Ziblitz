import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export const useCustomHookForObservable = (
  initialObservable: Observable<any>
) => {
  const [storedQuotes, setQuotes] = useState(0);
  const [observable, setObservable] = useState(initialObservable);
  useEffect(() => {
    let subscription = observable.subscribe((value: any) => {
      setQuotes(value);
    });

    return () => subscription.unsubscribe();
  }, [observable]);
  return { storedQuotes, setObservable };
};
