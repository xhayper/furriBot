import {BaseCommand} from "../Base/BaseCommand";
import {CommandClient} from "detritus-client/lib/commandclient";
import {Context, ParsedArgs} from "detritus-client/lib/command";

export default class extends BaseCommand {
    constructor(commandClient: CommandClient) {
        super(commandClient, {
            name: "help",
            type: [
                {name: "command"}
            ],
            metadata: {
                description: "Show command list and command information."
            }
        });
    }

    run(context: Context, args: ParsedArgs): any {
        if (args.command && context.commandClient.commands.some(command => command.name == args.command.toLowerCase())) {
            const targetCommand = context.commandClient.commands.find(command => command.name.toLowerCase() == args.command.toLowerCase());
            if (targetCommand != null) {
                const fields: Array<{ inline?: boolean; name: string; value: string; }> = [];
                if (targetCommand.metadata.description) {
                    fields.push({
                        name: "Description",
                        value: targetCommand.metadata.description,
                        inline: true
                    });
                }
                if (targetCommand.aliases.length > 0) {
                    fields.push({
                        name: "Aliases",
                        value: targetCommand.aliases.join("\n"),
                        inline: true
                    })
                }
                if (targetCommand.metadata.example) {
                    fields.push({
                        name: "Example",
                        value: targetCommand.metadata.example.join("\n"),
                        inline: true
                    });
                } else {
                    fields.push({
                        name: "Example",
                        value: targetCommand.name,
                        inline: true
                    })
                }
                return context.reply({
                    embed: {
                        author: {
                            iconUrl: context.client.user?.avatarUrl,
                            name: "Information Page"
                        },
                        fields: fields,
                        footer: {
                            iconUrl: context.message.author.avatarUrl,
                            text: `Requested by ${context.message.author.username}`
                        },
                        color: 65280,
                        timestamp: new Date(Date.now()).toISOString()
                    }
                });
            }
        }
        return context.reply({
            embed: {
                author: {
                    iconUrl: context.client.user?.avatarUrl,
                    name: `${context.client.user?.username}'s Command List`
                },
                description: `Type '${context.prefix}help [commandName]' for more information!`,
                fields: [{
                    name: "Commands",
                    value: `${context.commandClient.commands.map(command => command.name).join(",\n")}`,
                    inline: true
                }],
                footer: {
                    iconUrl: context.message.author.avatarUrl,
                    text: `Requested by ${context.message.author.username}`
                },
                color: 65280,
                timestamp: new Date(Date.now()).toISOString()
            }
        });
    }
}