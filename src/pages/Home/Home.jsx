import React, { useEffect, useState } from 'react';
import './Home.scss';
import Navbar from '../../components/Navbar/Navbar';

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    setUserName(storedName || "User");
  }, []);

  return (
    <div className='Finance_Manager'>
      <Navbar />
      <div className="main">
        <section id='home'>
          <h1 id='welcome__User'>Hi <span id='userName'>{userName}</span>,<br />See your Finance</h1>
        </section>
      </div>
    </div>
  );
}

export default Home;
