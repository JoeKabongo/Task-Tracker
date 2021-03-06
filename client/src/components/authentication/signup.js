import React from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Button } from '@material-ui/core';
import LoginWithGoogle from './googleLogin';
import { Link } from 'react-router-dom';
import axios from '../../api/index';
import useStyles from './style';

export default function SignupForm(props) {
  const classes = useStyles();
  const { saveUser, setAlert, alertDisplayed } = props;

  const [values, setValues] = React.useState({
    username: '',
    email: '',
    password: '',
    showPassword: false,
  });

  // change a state when a textfield is changed
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });

    // remove error message after using restart retyping
    if (alertDisplayed) {
      setAlert({ display: false, messages: [] });
    }
  };

  // toggle showing  password field as text
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // submit form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.username && values.email && values.password) {
      axios
        .post('/auth/signup', {
          email: values.email,
          username: values.username,
          password: values.password,
          confirmationPassword: values.password,
        })
        .then((response) => {
          // save user information
          const { jwtToken, user } = response.data;
          saveUser(jwtToken, user);
        })
        .catch((err) => {
          // display error message
          setAlert({
            display: true,
            messages: err.response
              ? err.response.data.errors
              : ['Something went wrong'],
            type: 'error',
          });
        });
    } else {
      setValues({
        ...values,
        errorMessages: ['All fields needs to be filled'],
      });
    }
  };

  return (
    <section>
      <div style={{ textAlign: 'center' }}>
        <h1> Signup</h1>
      </div>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          label="Username"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          required
          onChange={handleChange('username')}
        />

        <TextField
          label="Email"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          type="email"
          required
          onChange={handleChange('email')}
        />

        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password" required>
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.margin}
          style={{ display: 'block' }}
        >
          Signup
        </Button>
        <p>
          Have an account already? <Link to="login"> Login Here</Link>
        </p>
        {/* <LoginWithGoogle /> */}
      </form>
    </section>
  );
}
