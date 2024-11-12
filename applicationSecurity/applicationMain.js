import { retrievePassphrase } from "./keyRetrieve.js";
import { storeSecurityKey } from "./storeSecurityKey.js";
import fs from "fs";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

const exec = promisify(execCallback);

async function usePassPhrase() {
    await storeSecurityKey();
    const passphrase = await retrievePassphrase();
    if (passphrase) {
        console.log("Passphrase is retrieved,now we are using it for further processing.... ");

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const encryptFilePath = path.join(__dirname, "config.env.gpg");
        const decryptFilePath = path.join(__dirname, "config.env");

        try {
            await exec(`echo ${passphrase} | gpg --batch --yes --passphrase-fd 0 -d -o ${decryptFilePath} ${encryptFilePath}`);
            dotenv.config({ path: decryptFilePath });
            fs.unlinkSync(decryptFilePath);
            console.log("Decrypted .env file deleted.");
   
            console.log(Object.keys(process.env).filter((key) => key.startsWith("db_")));

        } catch (error) {
            console.error(`Error decrypting file: ${error.message}`);
        }
    }else{
        console.log("Failed to retrieve passphrase, aborting...");
    }
}

usePassPhrase();
