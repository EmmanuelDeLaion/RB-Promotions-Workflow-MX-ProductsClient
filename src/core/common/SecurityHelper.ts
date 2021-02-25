import { sp } from "@pnp/sp/presets/all";
import { UserValue } from "../infrastructure/UserValue";

export class SecurityHelper {
    public static async GetCurrentUser():Promise<UserValue> {
        const spUser = await sp.web.currentUser.get();
        return { ItemId: spUser.Id, Value: spUser.Title, Email: spUser.Email };
    }

    public static async GetUserId(id: number):Promise<UserValue> {
        const spUser = await sp.web.getUserById(id).get();
        return { ItemId: spUser.Id, Value: spUser.Title, Email: spUser.Email };
    }
}