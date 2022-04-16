import React, { Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UI/LoadingSpinner/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook'

const Users = React.lazy(() => import('./users/pages/Users'))
const Auth = React.lazy(() => import('./users/pages/Auth'))
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))

function App() { 
  const { token, login, logout, userId } = useAuth()
 
  let routes = (
    <Switch>
      <Route path="/" exact component= { Users } />
      <Route path="/auth" component={ Auth } />
      <Route path="/:id/places" component= { UserPlaces } />
      <Redirect to="/auth" />
    </Switch>      
  )

  if(!token){
    routes = (
      <Switch>
        <Route path="/" exact component= { Users } />
        <Route path="/:id/places" component= { UserPlaces } />
        <Route path="/places/new" component= { NewPlace } />
        <Route path="/places/:placeId" component={ UpdatePlace } />
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider 
      value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
        <BrowserRouter>
          <MainNavigation />
          <main>
            <Suspense 
              fallback={
                <div className="center"><LoadingSpinner /></div>
              }
            >
              {routes}
            </Suspense>
          </main>
        </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
