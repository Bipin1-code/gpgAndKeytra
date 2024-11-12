import keytar from "keytar";
import readline from "readline";

export async function storeSecurityKey() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    const service = "applicationSecurity";
    const account = "gpg-passphrase";
    
    rl.question("Enter passphrase: ", async (passphrase) => {
        try {
            await keytar.setPassword(service, account, passphrase);
            console.log("Successfully stored the passphrase in keyring.");
        } catch (error) {
            console.error("Failed to store the passphrase: ", error);
        } finally {
            rl.close();
        }
    });
}

