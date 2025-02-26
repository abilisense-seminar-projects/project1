import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { signUpValidationSchema } from '../../config/ValidationSchemas';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/actions/registerActions';
import { useTranslation } from 'react-i18next'
import { SERVER_BASE_URL } from '@env';

const SignUpScreen = ({ onStepChange }) => {

  const user = useSelector((state) => state.register.userData);
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: user.password,
  });

  const fieldDisplayNames = {
    firstname: t('First name'),
    lastname: t('Last name'),
    email: t('Email'),
    password: t('Password'),
  };

  const dispatch = useDispatch();

  const handleInputChange = (key, text) => {
    setFormData({ ...formData, [key]: text });
    setErrors({ ...errors, [key]: null }); // Reset error when the user starts typing
  };

  const isFieldValid = (key) => {
    if (formData[key] && !errors[key]) {
      // Check validation conditions
      try {
        signUpValidationSchema(t).validateSyncAt(key, formData);
        return true;
      } catch (validationError) {
        return false;
      }
    }
    return false;
  };

  const renderLabel = (key) => {
    return (
      <Text style={styles.placeholderLabel}>
        {formData[key] ? fieldDisplayNames[key] : ''}
      </Text>
    );
  };

  const handleSignUp = async (newStep) => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      try {
        signUpValidationSchema(t).validateSyncAt(key, formData);
      } catch (validationError) {
        formErrors[key] = validationError.message;
      }
    });

    if (Object.keys(formErrors).length === 0) {
      // No errors, proceed to the next step
      setErrors({});
      checkIfEmailExistsFunction(newStep);
    } else {
      // Validation failed, set the errors
      setErrors(formErrors);
    }
  }

  const checkIfEmailExistsFunction = async (newStep) => {
    const result = await checkIfEmailExists(formData.email);
    if (!result) {
      console.log("Excellent! There is no such email");
      // send data to store
      dispatch(setUserData(formData));
      onStepChange(newStep);
    } else {
      console.log("Invalid email");
      // Set the error for the 'email' key
      setErrors({ ...errors, email: t('Provide a valid email') });
      // You can also display a message to the user if needed
    }
  };

  const checkIfEmailExists = async (email) => {
    try {
      return await axios.post(`${SERVER_BASE_URL}/api/patients//get-by-email/`, { email })
        .then(response => {
          console.log('The form data:', response.data);
          return response.data
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error fetching data:', error);
    }
  };

  return (
    // <ImageBackground source={require('../../assets/images/rm222-mind-24.jpg')} resizeMode="cover" style={styles.backgroundImage}>

    <View style={styles.container}>
      
      <Text style={styles.title}>{t("Sign Up")}</Text>

      {Object.keys(formData).map((key) => (
        <View key={key} style={styles.inputContainer}>
          {renderLabel(key)}
          <TextInput
            style={{
              ...styles.input,
              height: 40, // Set a fixed height for the input
              borderColor: isFieldValid(key) ? 'green' : errors[key] ? 'red' : 'gray',
            }}
            placeholder={fieldDisplayNames[key]}
            onChangeText={(text) => handleInputChange(key, text)}
            value={formData[key]}
            keyboardType={key === 'email' ? 'email-address' : 'default'}
            secureTextEntry={key === 'password'}
          />
          {isFieldValid(key) && (
            <View style={styles.iconContainer}>
              <MaterialIcons name="check" size={24} color="green" style={styles.icon} />
            </View>
          )}
          {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        {/* <Pressable style={styles.buttonPrev} onPress={() => onStepChange(1)}>
          <Text style={styles.buttonText}>{t("Prev")}</Text>
        </Pressable> */}

        <Pressable style={styles.buttonNext} onPress={() => handleSignUp(2)}>
          <Text style={styles.buttonText}>{t("Next")}</Text>
        </Pressable>
      </View>
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 5,
    fontSize: 18,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    width: '80%',
    marginTop: 20,
  },
  buttonNext: {
    backgroundColor: "#E33458",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    maxWidth: 150, // Set your desired maximum width
  },

  icon: {
    marginLeft: 10, // Adjust the margin as needed
  },
  iconContainer: {
    position: 'absolute',
    top: 12,
    right: -30,
  },
  placeholderLabel: {
    position: 'absolute',
    left: 10,
    top: -8,
    fontSize: 12,
    backgroundColor: 'rgb(243, 243, 243)',
    paddingHorizontal: 5,
    color: 'black',
  },
});

export default SignUpScreen;