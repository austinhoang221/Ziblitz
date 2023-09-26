import React from "react";
import "./index.scss";
export default function Authentication() {
  const onSubmit = () => {};
  return (
    <>
      <section className="vh-100 c-login">
        <header className="c-login-header">
          <img src="" className="mr-2" alt="Logo"></img>
          <h1>HeadUp</h1>
        </header>
        <div className="c-login-section">
          <h2 className="mb-4 text-center">Welcome back</h2>
          <form onSubmit={onSubmit}>
            <div className="text-center text-lg-start mt-4 pt-2">
              <button type="submit" className="pl-2 pr-2">
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
