import React, { useContext } from 'react';
import { AuthContext } from '@/layouts/AuthContext';
import UPHomepage from '@/components/Home/UPHomepage';
import Guest from '@/components/Home/Guest';
import '@/style/Homepage.css';

function Homepage() {
  const { user } = useContext(AuthContext);

  // Check if user is defined and role exists
  const isUrbanPlanner = user?.role === "Urban Planner";

  return !isUrbanPlanner ? (
    <Guest/>
  ) : (
    <UPHomepage />
  );
}

export default Homepage;

