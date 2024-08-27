import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// Componentes
import { Header } from '../private/Header';
import { Sidebar } from './Sidebar';

// Context
import { useAuth } from '../../../context/AuthContext';
import { useUser } from '../../../context/UserContext';
import { usePublication } from '../../../context/PublicationContext';
import { useFollow } from '../../../context/FollowContext';

export const PrivateLayout = () => {
  const { loading, isAuthenticated, user } = useAuth();
  const { fetchCounters } = useUser();
  const { fetchPublicationsUser, publicationChanged } = usePublication();
  const { followChanged } = useFollow();

  useEffect(() => {
    if (isAuthenticated && user && followChanged) {
      fetchCounters(user.id);
      fetchPublicationsUser(user.id);
    }

  }, [isAuthenticated, user, followChanged, publicationChanged]);

  if (loading) return <h1>Loading...</h1>;
  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className='layout__private'>
      <Header />
      <section className="layout__content">
        <Outlet />
      </section>
      <Sidebar />
    </div>
  );
};
