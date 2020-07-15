import React, { Component } from 'react';
import Input from '../components/Input/Input';
import { signupUser } from '../redux/actions/userActions';
import { connect } from 'react-redux';
import { CLEAR_ERRORS } from '../redux/types';
import Spinner from '../components/Spinner/Spinner';
class signup extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    errors: null,
  };

  componentWillUnmount() {
    this.props.clearErrors();
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = () => {
    const { email, password, confirmPassword, username } = this.state;
    const userData = {
      email,
      password,
      confirmPassword,
      username,
    };
    this.props.signupUserAction(userData, this.props.history);
  };
  render() {
    const { errors } = this.props.user;
    return (
      <div className='form'>
        <Input
          label='Email'
          type='email'
          name='email'
          value={this.state.email}
          onChange={this.handleChange}
          error={errors ? (errors.email ? errors.email : null) : null}
        />
        <Input
          label='Password'
          type='password'
          styles={{ fontWeight: 'bold' }}
          name='password'
          value={this.state.password}
          onChange={this.handleChange}
          error={errors ? (errors.password ? errors.password : null) : null}
        />
        <Input
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          styles={{ fontWeight: 'bold' }}
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          error={
            errors
              ? errors.confirmPassword
                ? errors.confirmPassword
                : null
              : null
          }
        />
        <Input
          label='Username'
          type='text'
          name='username'
          value={this.state.username}
          onChange={this.handleChange}
          error={errors ? (errors.username ? errors.username : null) : null}
        />
        <button className='form-button' onClick={this.handleSubmit}>
          {this.props.loading ? <Spinner /> : 'Signup'}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  loading: state.user.loading,
});
const mapActionsToProps = (dispatch) => ({
  signupUserAction: (userData, history) =>
    dispatch(signupUser(userData, history)),
  clearErrors: () => dispatch({ type: CLEAR_ERRORS }),
});

export default connect(mapStateToProps, mapActionsToProps)(signup);
