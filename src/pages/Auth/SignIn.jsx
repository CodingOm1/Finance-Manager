import React, { useState } from "react";
import './SignIn.scss'
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineAttachEmail, MdOutlinePassword } from "react-icons/md";
import NavUse from "../../components/Nav_user/NavUse";
import { auth, db } from "../../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Function to toggle between Sign Up and Login
  function toggleState() {
    setState((prevState) => (prevState === "Sign Up" ? "Login" : "Sign Up"));
    setError("");
  }

  // Function to handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email
      });

      // Save user name and authentication status in localStorage
      localStorage.setItem("userName", name);
      localStorage.setItem("isAuthenticated", "true"); // Set authenticated status

      toast.success("Sign up successful!");
      navigate("/"); // Redirect to home page after successful sign-up
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Retrieve user details if needed (e.g., show a welcome message)
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      // You could fetch user details here if needed

      localStorage.setItem("isAuthenticated", "true"); // Set authenticated status
      toast.success(`Welcome back, ${name || "User"}!`);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <NavUse />
      <form
        className="authForm"
        onSubmit={state === "Sign Up" ? handleSignUp : handleLogin}
      >
        <h2 id="formState">{state}</h2>
        {state === "Sign Up" ? (
          <div className="fields">
            <div className="inputForm">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <CgProfile className="fieldIcon" />
            </div>
            <div className="inputForm">
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdOutlineAttachEmail className="fieldIcon" />
            </div>
            <div className="inputForm">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MdOutlinePassword className="fieldIcon" />
            </div>
            <div className="inputForm">
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <RiLockPasswordLine className="fieldIcon" />
            </div>
            <button id="formBtn" disabled={loading}>
              {loading ? <div className="spinner"></div> : state}
            </button>
            <div className="stateToggler">
              {state === "Sign Up" ? (
                <p>
                  Already have an account?
                  <span id="stateChanger" onClick={toggleState}>
                    Login Here
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?
                  <span id="stateChanger" onClick={toggleState}>
                    Sign Up Here
                  </span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="fields">
            <div className="inputForm">
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdOutlineAttachEmail className="fieldIcon" />
            </div>
            <div className="inputForm">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MdOutlinePassword className="fieldIcon" />
            </div>
            <button id="formBtn" disabled={loading}>
              {loading ? "Loading..." : state}
            </button>
            <div className="stateToggler">
              {state === "Sign Up" ? (
                <p>
                  Already have an account?
                  <span id="stateChanger" onClick={toggleState}>
                    Login Here
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?
                  <span id="stateChanger" onClick={toggleState}>
                    Sign Up Here
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
