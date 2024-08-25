import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "react-toastify";
import { auth, db } from "../../utils/firebase";
import { signOut, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import "./Navbar.scss";

const Navbar = () => {
  const [setting, setSetting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State to show confirmation dialog
  const navigate = useNavigate();

  // Toggle settings dropdown
  function toggleSetting() {
    setSetting((prevState) => !prevState);
  }

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out user
      localStorage.removeItem("isAuthenticated"); // Remove authenticated status
      localStorage.removeItem("userName"); // Optional: Remove user name
      toast.success("Logged out successfully!");
      navigate("/auth"); // Redirect to the auth page
    } catch (error) {
      toast.error("Error logging out.");
    }
  };

  // Handle account deletion with confirmation
  const handleDeleteAccount = () => {
    setShowConfirmDialog(true); // Show confirmation dialog
  };

  // Function to confirm account deletion
  const confirmDeleteAccount = async () => {
    setShowConfirmDialog(false); // Hide confirmation dialog
    try {
      const user = auth.currentUser;

      if (user) {
        // Delete user from Firestore
        const userDocRef = doc(db, "users", user.uid); // Assuming the collection is "users"
        await deleteDoc(userDocRef);

        // Delete the user from Firebase Authentication
        await deleteUser(user);

        localStorage.clear(); // Clear localStorage
        toast.success("Account deleted successfully.");
        navigate("/auth"); // Redirect to the auth page after deletion
      }
    } catch (error) {
      toast.error("Error deleting account.");
    }
  };

  // Function to cancel account deletion
  const cancelDeleteAccount = () => {
    setShowConfirmDialog(false); // Hide confirmation dialog
  };

  return (
    <div className="navbar__home">
      <div className="navbar__logo">
        <h2>Finance Manager.</h2>
      </div>
      <ul className="navbar__links">
        <li>Home</li>
        <li>Loan Calculation</li>
        <li>Analytic</li>
      </ul>
      <div className="setting">
        <IoMdSettings onClick={toggleSetting} className="icon" />
        <div className={!setting ? "disable" : "hover__box"}>
          <li onClick={handleLogout}>
            <AiOutlineLogout className="set__icon" />
            Logout
          </li>
          <li onClick={handleDeleteAccount}>
            <MdDelete className="set__icon" />
            Account
          </li>
        </div>
      </div>


      {showConfirmDialog && ( 
        <div className="confirm-dialog">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button onClick={confirmDeleteAccount}>Yes, Delete</button>
          <button onClick={cancelDeleteAccount}>Cancel</button>
        </div>
     )} 
    </div>
  );
};

export default Navbar;
