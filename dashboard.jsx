import React from 'react';

function ProfilePage({ isLoggedIn, user }) {
  // If the user is not logged in, show the 403 message
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>403</h1>
        <p>User Not Found</p>
      </div>
    );
  }

  // If the user is logged in, show their profile
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default ProfilePage;
