import keytar from 'keytar';

const service = "applicationSecurity";
const account = "gpg-passphrase";

export async function retrievePassphrase() {
    try {
        const passphrase = await keytar.getPassword(service, account);

        if (passphrase) {
            console.log("Passphrase is retrieved successfully.");
            return passphrase;
        }
        else {
            console.log("Passphrase not found!");
            return null;
        }
    } catch (error) {
        console.log("Failed to retrieve passphrase: ", error);
        return null;
    }
}