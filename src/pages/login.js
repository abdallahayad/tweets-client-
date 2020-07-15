import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';
import Input from '../components/Input/Input';
import Spinner from '../components/Spinner/Spinner';
import { CLEAR_ERRORS } from '../redux/types';

class login extends Component {
  state = {
    email: '',
    password: '',
    errors: null,
  };

  componentWillUnmount() {
    this.props.clearErrors();
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = () => {
    const { email, password } = this.state;
    const userData = {
      email,
      password,
    };
    this.props.loginUserAction(userData, this.props.history);
  };
  render() {
    const { errors } = this.props.user;
    return (
      <div className='form'>
        <Input
          label='Email'
          name='email'
          type='email'
          value={this.state.email}
          onChange={this.handleChange}
          error={errors && errors.email && errors.email}
        />
        <Input
          label='Password'
          type='password'
          name='password'
          value={this.state.password}
          styles={{ fontWeight: 'bold' }}
          onChange={this.handleChange}
          error={errors && errors.password}
        />
        <p
          style={{
            textAlign: 'center',
            color: '#ff0033b6',
            marginTop: '10px',
            fontSize: '12px',
          }}
        >
          {errors && errors.error}
        </p>
        <button className='form-button' onClick={this.handleSubmit}>
          {this.props.loading ? <Spinner /> : 'Login'}
        </button>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  loading: state.user.loading,
  user: state.user,
});
const mapActionsToProps = (dispatch) => ({
  loginUserAction: (userData, history) =>
    dispatch(loginUser(userData, history)),
  clearErrors: () => dispatch({ type: CLEAR_ERRORS }),
});

export default connect(mapStateToProps, mapActionsToProps)(login);
