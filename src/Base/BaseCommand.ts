import {Command, Context} from "detritus-client/lib/command";
import {CommandRatelimit, CommandRatelimitItem} from "detritus-client/lib/command/ratelimit";

export class BaseCommand extends Command {

    onRatelimit(context: Context, ratelimits: Array<{
        item: CommandRatelimitItem;
        ratelimit: CommandRatelimit;
        remaining: number;
    }>, metadata: any): any {
        if (!ratelimits[0].item.replied) {
            ratelimits[0].item.replied = true;
            return context.reply(`Hey! You're on cooldown! (${Math.round(ratelimits[0].remaining / 1000)} s)`);
        }
    }
}