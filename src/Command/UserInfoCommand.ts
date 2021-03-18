import {BaseCommand} from "../Base/BaseCommand";
import {CommandClient} from "detritus-client/lib/commandclient";
import {Context, ParsedArgs} from "detritus-client/lib/command";
import moment from "moment";

export default class extends BaseCommand {

    constructor(commandClient: CommandClient) {
        super(commandClient, {
            name: "userInfo",
            aliases: ["ui"],
            type: [
                {name: "user", type: "string"}
            ],
            metadata: {
                description: "Get information on a user or on yourself",
                example: [
                    "userInfo",
                    "userInfo 318840403845578764",
                    "userInfo <@318840403845578764>"
                ]
            }
        });
    }

    run(context: Context, args: ParsedArgs): any {
        let targetUser;
        if (args.user) {
            if (context.client.users.has(args.user)) targetUser = context.client.users.get(args.user);
            else if (context.message.mentions.size > 0) targetUser = context.message.mentions.toArray()[0];
            if (targetUser == null) targetUser = context.message.author;
        } else {
            targetUser = context.message.author;
        }
        return context.reply({
            embed: {
                author: {
                    name: `${targetUser.username}'s Information`,
                    iconUrl: targetUser.avatarUrl
                },
                fields: [
                    {
                        name: "Date",
                        value: `Created : ${moment(targetUser.createdAt).format("Do MMMM YYYY, h:mm a")}\nJoined : ${moment(context.message.member?.joinedAt).format("MMMM Do YYYY, h:mm a")}`,
                        inline: true
                    }],
                footer: {
                    iconUrl: context.message.author.avatarUrl,
                    text: `Requested by ${context.message.author.username}`
                },
                color: 65280,
                timestamp: new Date(Date.now()).toISOString()
            }
        })
    }
}