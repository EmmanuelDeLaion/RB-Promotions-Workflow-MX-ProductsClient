import { sp } from "@pnp/sp/presets/all";
import { LookupValue } from "../infrastructure";

export class SecurityHelper {
    public static async GetCurrentUser():Promise<LookupValue> {
        const spUser = await sp.web.currentUser.get();
        return { ItemId: spUser.Id, Value: spUser.Title };
    }
}