import { IItemAddResult, sp } from "@pnp/sp/presets/all";

export class EmailSenderRepository {
    private static LIST_NAME: string = "EmailSender";

    public static Add(to: string, cc: string, subject: string, body: string)
    {
        sp.web.lists.getByTitle(EmailSenderRepository.LIST_NAME).items.add({
            Title: to,
            CC: cc,
            Subject: subject,
            Body: body
          });
    }
}