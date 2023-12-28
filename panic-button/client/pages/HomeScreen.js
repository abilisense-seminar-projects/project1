import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SosButton from '../components/sos_button/SosButton';
import Status from '../components/sos_button/Status';
import ProblemType from '../components/sos_button/ProblemType';
import SendAlert from '../components/sos_button/SendAlert';
import FindLocation from '../components/sos_button/FindLocation';
import CancelButton from '../components/sos_button/CancelButton';
import AlertSendingConfirmationModel from '../components/sos_button/AlertSendingConfirmationModel';
import SquareIconButton from '../components/home/SquareIconButton';
import LocationButton from '../components/home/LocationButton'


const HomeScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [alert, setAlert] = useState();
    const [modalVisible, setModalVisible] = useState(true);

    const handleCancel = () => {
        setModalVisible(false);
        setStep(1);

    };

    const onSendAlert = () => {
        handleStepChange()
    }

    const handleStepChange = () => {
        if (step == 6) {
            setStep(1);
        }
        else {
            setStep(step + 1);
        }

    };

    const addParamsToAlert = (jsonParams) => {
        setAlert({ ...alert, ...jsonParams })
    };

    useFocusEffect(
        React.useCallback(() => {
            setStep(1);
        }, [])
    );

    const handlelocationPress = () => {
        console.log('Button pressed!');
        setStep(7)
    };
    const handleButtonPress = () => {
        console.log('Button pressed!');
    };

    return (
        <>
            {
                step === 1 &&
                <View style={styles.container}>
                    <View style={styles.buttonsContainer}>
                        <SosButton onStepChange={handleStepChange} style={{ backgroundColor: 'transparent' }} />
                        <View style={styles.iconsContainer}>
                            <View style={styles.iconRow}>
                                <SquareIconButton onPress={handlelocationPress} iconName="location-on" />
                                <View style={styles.iconSpacing} />
                                <SquareIconButton onPress={handleButtonPress} iconName="keyboard" />
                                <View style={styles.iconSpacing} />
                                <SquareIconButton onPress={handleButtonPress} iconName="keyboard" />
                                <View style={styles.iconSpacing} />
                                <SquareIconButton onPress={handleButtonPress} iconName="keyboard" />
                            </View>
                        </View>
                    </View>
                </View>
            }
            {
                step === 2 &&
                <>
                    <CancelButton navigation={navigation} />
                    <Status onStepChange={handleStepChange} addParamsToAlert={addParamsToAlert} />
                </>
            }
            {
                step === 3 &&
                <>
                    <CancelButton navigation={navigation} />
                    <ProblemType onStepChange={handleStepChange} addParamsToAlert={addParamsToAlert} />
                </>
            }
            {
                step === 4 &&
                <>
                    <CancelButton navigation={navigation} />
                    <FindLocation onStepChange={handleStepChange} addParamsToAlert={addParamsToAlert} />
                </>
            }
            {
                step === 5 &&
                <>
                    <CancelButton navigation={navigation} />
                    <AlertSendingConfirmationModel
                        visible={modalVisible}
                        onClose={handleCancel}
                        onSendAlert={onSendAlert} />
                </>
            }
            {
                step === 6 &&
                <>
                    {/* <CancelButton navigation={navigation}/> */}
                    <SendAlert alert={alert} onStepChange={handleStepChange} />
                </>
            }
            {
                step === 7 &&
                <>
                    <LocationButton/>
                </>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
    },
    iconsContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSpacing: {
        width: 20, // Adjust spacing between icons
    },
});
export default HomeScreen;
