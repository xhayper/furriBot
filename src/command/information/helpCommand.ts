import {Command} from "detritus-client";
import {CommandClient} from "detritus-client/lib/commandclient";
import {CommandOptions} from "detritus-client/lib/command/command";
import {Context, ParsedArgs} from "detritus-client/lib/command";
import {RequestTypes} from "detritus-client-rest/lib/types";

export default class extends Command.Command {

    constructor(commandClient:CommandClient, options:CommandOptions) {
        super(commandClient, options);
        this.name = "help";
        this.label = "commandName";
        this.type = String;
        this.metadata = {
            "category": "information",
            "description": "Give information on a command or Get command list",
            "usage": [
                "help",
                "help <CommandName>"
            ],
            "example": [
                "help",
                "help help"
            ]
        }
    }

    run(context:Context, args:ParsedArgs) {
        const embed:RequestTypes.CreateChannelMessageEmbed = {};
        embed.fields = [];
        embed.color = 65280;
        embed.footer = {text : `Requested by ${context.message.author.name}`, iconUrl: context.message.author.avatarUrl};
        embed.timestamp = new Date(Date.now()).toISOString();
        if (args.commandName) {
            const command = this.commandClient.commands.find(command => command.name.toLowerCase() == args.commandName.toLowerCase()
                || command.aliases.map(commandAliases => commandAliases.toLowerCase()).includes(args.commandName.toLowerCase()));
            if (command != null) {
                embed.title = command.name;
                if (command.metadata.category) embed.fields.push({
                    name: "Category",
                    value: command.metadata.category,
                    inline: true
                });
                if (command.metadata.description) embed.fields.push({
                    name: "Description",
                    value: command.metadata.description,
                    inline: true
                });
                if (command.aliases.length != 0) embed.fields.push({
                    name: "Aliases",
                    value: command.aliases.map(aliases => aliases.toLowerCase()).join("\n"),
                    inline: true
                });
                if (command.metadata.usage) embed.fields.push({
                    name: "Usage",
                    value: command.metadata.usage.join("\n"),
                    inline: true
                });
                else embed.fields.push({name: "Usage", value: command.name, inline: true});
                if (command.metadata.example) embed.fields.push({
                    name: "Example",
                    value: command.metadata.example.join("\n"),
                    inline: true
                });
                else embed.fields.push({name: "Example", value: command.name, inline: true});
                return context.reply({embed: embed});
            }
        }
        embed.title = "Help Page";
        const categories:string[] = [];
        for (let command of this.commandClient.commands) {
            if (command.metadata.category && !categories.includes(command.metadata.category.toLowerCase())) categories.push(command.metadata.category.toLowerCase());
            else if (!command.metadata.category && !categories.includes("uncategorized")) categories.push("uncategorized");
        }
        for (let category of categories) {
            embed.fields.push({
                name: category.charAt(0).toUpperCase() + category.substr(1).toLowerCase(),
                value: this.commandClient.commands.filter(command => !command.metadata.category && category.toLowerCase() == "uncategorized" || command.metadata.category.toLowerCase() == category.toLowerCase()).map(command => command.name.toLowerCase()).join("\n"),
                inline: true
            });
        }
        return context.reply({embed: embed});
    }

}