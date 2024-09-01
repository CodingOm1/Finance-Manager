import React, { useState, useEffect } from 'react';
import './Home.scss';
import Navbar from '../../components/Navbar/Navbar';
import FinanceChart from '../../components/Chart/FinanceChart'; // Import the chart component
import MainPage from '../../components/MainPage/MainPage';

const Home = () => {
  const [userName, setUserName] = useState("User");


  useEffect(() => {
    try {
      const storedName = localStorage.getItem("userName");
      setUserName(storedName || "User");
    } catch (error) {
      console.error("Failed to retrieve user name from localStorage:", error);
      setUserName("User");
    }

  }, []);

  return (
    <div className='Finance_Manager'>
      <Navbar />
      <div className="main">
        <section id='home'>
          <MainPage />
        </section>
      </div>
    </div>
  );
};

export default Home;
