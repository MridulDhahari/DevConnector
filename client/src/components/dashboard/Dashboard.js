// import React,{Fragment, useEffect} from 'react'
// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// import {Link} from 'react-router-dom';
// import { getCurrentProfile } from '../../actions/profile'
// import Spinner from '../layout/Spinner'


// const Dashboard = ({getCurrentProfile,auth:{user},profile:{loading,profile}}) => {
//   useEffect(()=>{
//     getCurrentProfile();
//   },[]);
//   return loading && profile===null ? (<Spinner/>): (
//     <Fragment>
//     <h1 className="large text-primary">Dashboard</h1>
//     <p className='lead'>
//     <i className='fas fa-user'></i>Welcome {user && user.name}
//     </p>
//     {profile!==null ? <Fragment>has</Fragment> : 
//     <Fragment>
//     <p>You hae not yet setup a profile, please add some information</p>
//     <Link to='/create-profile' className='bt btn-primary my-1'>
//       Create Profile
//     </Link>
//     </Fragment>}
    
//   </Fragment>
//   );
 
// }

// Dashboard.propTypes = {
//   getCurrentProfile: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   profile: PropTypes.object.isRequired,
// }

// const mapStateToProps = state => ({
//   auth: state.auth,
//   profile: state.profile
// })

// export default connect(mapStateToProps,{getCurrentProfile})(Dashboard);

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return (
    <section className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </>
      )}
    </section>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
