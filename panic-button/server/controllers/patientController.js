const {
    getAllPatients,
    getPatientByEmail,
    getPatientById,
    addPatient,
    deletePatientByEmail,
    deletePatientById,
    getPatientByEmailAndPassword } = require('../repositories/patientRepo');

async function getAllPatientsBL() {
    return await getAllPatients();
}

async function getPatientByEmailBL(email) {
    return await getPatientByEmail(email);
}

async function getPatientByEmailAndPasswordBL(email, password) {
    return await getPatientByEmailAndPassword(email, password);
}

async function getPatientByIdBL(email) {
    return await getPatientById(email);
}

async function addPatientBL(patient) {
    return await addPatient(patient);
}

async function deletePatientByIdBL(_id) {
    return await deletePatientById(_id);
}

async function deletePatientByEmailBL(email) {
    return await deletePatientByEmail(email);
}



module.exports = {
    getAllPatientsBL,
    getPatientByEmailBL,
    getPatientByIdBL,
    addPatientBL,
    deletePatientByEmailBL,
    deletePatientByIdBL,
    getPatientByEmailAndPasswordBL
};