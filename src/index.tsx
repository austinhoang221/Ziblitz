import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./app/assets/styles/utilities.scss";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <App />
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);
