// src/router/routing.jsx
import React from 'react';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';

// Componentes Publicos
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { Register } from '../components/user/Register';
import { Login } from '../components/user/Login';

// Componentes Privados
import { Feed } from '../components/publication/Feed';
import { FollowingList } from '../components/follow/FollowingList';
import { FollowerList } from '../components/follow/FollowerList';
import { UserList } from '../components/user/UserList';
import { Profile } from '../components/user/Profile';
import { PublicationsList } from '../components/publication/PublicationsList';
import { EditProfile } from '../components/user/EditProfile';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';

// Context
import { AuthProvider } from '../context/AuthContext';
import { UserProvider } from '../context/UserContext';
import { PublicationProvider } from '../context/PublicationContext';
import { FollowProvider } from '../context/FollowContext';

const Routing = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <FollowProvider>
          <PublicationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Login />}></Route>
                  <Route path="login" element={<Login />}></Route>
                  <Route path="register" element={<Register />}></Route>
                </Route>

                <Route path="/social" element={<PrivateLayout />}>
                  <Route index element={<Feed />}></Route>
                  <Route path="feed" element={<Feed />}></Route>
                  <Route path="following" element={<FollowingList />}></Route>
                  <Route path="follower" element={<FollowerList />}></Route>
                  <Route path="people" element={<UserList />}></Route>
                  <Route path="profile/:nick" element={<Profile />} />
                  <Route path="publications" element={<PublicationsList />} />
                  <Route path='settings' element={<EditProfile />} />
                </Route>

                <Route path='*' element={
                  <div>
                    <h1>Error 404</h1>
                    <Link to="/">Home</Link>
                  </div>
                } />
              </Routes>
            </BrowserRouter>
          </PublicationProvider>
        </FollowProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default Routing;
