import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { loginValidationSchema } from '../config/loginValidationSchema'; 
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/actions/loginActions';
import { useSelector } from 'react-redux';
import { BY_EMAIL_AND_PASSWORD, SERVER_BASE_URL } from '@env';
import * as Yup from 'yup';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const checkLoggedInUser = async () => {
        try {
          const emailUser = await AsyncStorage.getItem('email');
          const passwordUser = await AsyncStorage.getItem('password');
          if (emailUser !== null && passwordUser !== null) {
            navigation.navigate('Home');
          } else {
            console.log('No user is logged in');
          }
        } catch (e) {
          console.error('Error fetching user data:', e);
        }
      };
      checkLoggedInUser();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      await loginValidationSchema.validate({ email, password }, { abortEarly: false });

      const response = await checkEmailAndpassword(email, password)
      if (response.success === true) {
        dispatch(loginSuccess(response.user));
        await AsyncStorage.setItem('email', response.user.email);
        await AsyncStorage.setItem('password', response.user.password);
        navigation.navigate('Home');
      } else {
        setErrorMessage('user name or password invalid');
      }

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const yupErrors = {};
        error.inner.forEach((e) => {
          yupErrors[e.path] = e.message;
        });
        setErrors(yupErrors);
      }
      setErrorMessage('user name or password invalid');
    }
  };

  const checkEmailAndpassword = async (email, password) => {
    // try {
    const url = SERVER_BASE_URL + BY_EMAIL_AND_PASSWORD;
    return await axios.post(url, { email, password })
      .then(response => {
        console.log('Data in checkEmailAndpassword:', response.data);
        return response.data
      })
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => navigation.navigate('SignUpPage')}
      >
        <Text style={styles.register}>Register</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.email && styles.invalidInput]}
          placeholder="Email"
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: '' });
          }}
          value={email}
        />
        {errors.email && <Text style={styles.warningText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.password && styles.invalidInput]}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: '' });
          }}
          value={password}
        />
        {errors.password && <Text style={styles.warningText}>{errors.password}</Text>}
      </View>

      <View style={styles.forgotPasswordContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  invalidInput: {
    borderColor: 'red',
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotPassword: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  registerContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  register: {
    fontSize: 16,
    color: 'blue',
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

//   return (
//     <View style={styles.container}>
//       <View style={styles.registerContainer}>
//         <Button
//           title="Register"
//           style={styles.register}
//           onPress={() => navigation.navigate('SignUpPage')}
//         />
//       </View>
//       <Text style={styles.header}>Login</Text>
//       <TextInput
//         style={[styles.input, errors.email && styles.invalidInput]}
//         placeholder="Email"
//         onChangeText={(text) => {
//           setEmail(text);
//           setErrors({ ...errors, email: '' });
//         }}
//         value={email}
//       />
//       {errors.email && <Text style={styles.warningText}>{errors.email}</Text>}

//       <TextInput
//         style={[styles.input, errors.password && styles.invalidInput]}
//         placeholder="Password"
//         secureTextEntry
//         onChangeText={(text) => {
//           setPassword(text);
//           setErrors({ ...errors, password: '' });
//         }}
//         value={password}
//       />
//       {errors.password && <Text style={styles.warningText}>{errors.password}</Text>}

//       <Text
//         style={styles.forgotPassword}
//         onPress={() => navigation.navigate('ForgetPassword')}
//       >
//         Forgot Password?
//       </Text>
//       {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     width: '70%',
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 10,
//   },
//   invalidInput: {
//     borderColor: 'red',
//   },
//   warningText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 5,
//   },
//   forgotPassword: {
//     fontSize: 16,
//     color: 'blue',
//     textDecorationLine: 'underline',
//     marginBottom: 10,
//   },
//   register: {
//     fontSize: 16,
//     color: 'blue',
//   },
//   registerContainer: {
//     position: 'absolute',
//     left: 10,
//     top: 10,
//     zIndex: 1,
//   },
// });

export default Login;