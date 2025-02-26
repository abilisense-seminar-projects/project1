import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SERVER_BASE_URL } from '@env';

const CancelAlertButton = ({ navigation, alertId}) => {
    const { t, i18n } = useTranslation();
    const url =`${SERVER_BASE_URL}/api/alerts/update-alert/${alertId}`;

    const handleCancel = async () => {
        const statusUpdate = { "status": "canceled" };
        try {
            const response = await axios.put(url, statusUpdate);
            console.log('Response from server: ', response.data);
        } catch (error) {
            console.error('Error updating alert:', error);
        }

        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel()}>
                <Text style={styles.cancelButtonText}>{t("Cancel alert")}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // backgroundColor: 'white',
        justifyContent: 'center',
        paddingTop: 10,
    },
    cancelButton: {
        width: '100%',
        height: 50,
        backgroundColor: "#E33458", // Adjust the color to match your design
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CancelAlertButton;
