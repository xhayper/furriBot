import * as path from "path";

import {ClusterClient, CommandClient, ShardClient} from "detritus-client";
import {BaseConfiguration} from "./Base/BaseConfiguration";

require("dotenv").config({
    path: path.resolve(__dirname, "../configuration/.env")
});

if (process.env.DISCORD_TOKEN == null) throw new ReferenceError("DISCORD_TOKEN isn't defined in process.env");

const config:BaseConfiguration = require(path.resolve(__dirname, "../configuration/config.json"));

const commandClient = new CommandClient(process.env.DISCORD_TOKEN, {
    useClusterClient: true,
    prefix: config.prefix
});

if (commandClient.client instanceof ShardClient) throw new TypeError("commandClient is ShardClient for some reason?");

const client:ClusterClient = commandClient.client;

client.on('ready', () => {
    commandClient.addMultipleIn(path.resolve(__dirname, "./Command"), {
        subdirectories: true,
        isAbsolute: true
    }).then();
    console.log(`Ready!`);
});

(async () => {
    await commandClient.run();
})();