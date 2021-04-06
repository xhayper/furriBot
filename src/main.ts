import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../Configuration/.env")
});

if (process.env.DISCORD_TOKEN == null) throw new ReferenceError("process.env.DISCORD_TOKEN isn't defined!")

import {CommandClient} from 'detritus-client';
import {BaseConfiguration} from "./base/baseConfiguration";

const config:BaseConfiguration = require(path.resolve(__dirname, "../Configuration/config.json"));

const commandClient = new CommandClient(process.env.DISCORD_TOKEN, {
    prefix: config.prefix,
    useClusterClient: true
});

commandClient.addMultipleIn(path.resolve(__dirname, "./command"), {
    subdirectories: true,
    isAbsolute: true
}).then();

commandClient.client.on("ready", () => {
    commandClient.addMentionPrefixes();
    console.info("Ready!");
});

commandClient.run().then();