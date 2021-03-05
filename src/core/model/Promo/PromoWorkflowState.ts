import { CommonHelper } from "../../common/CommonHelper";
import { SecurityHelper } from "../../common/SecurityHelper";

export class PromoWorkflowState {
    public ApproverIDs: number[] = [];
    public CompletedBy: number[] = [];

    constructor(approverIDs: number[], completedBy?: number[]) {
        this.ApproverIDs = approverIDs;
        this.CompletedBy = completedBy || [];
    }

    public IsComplete():boolean {
        return this.ApproverIDs.length == this.CompletedBy.length;
    }

    public UserCanApprove(userId: number): boolean
    {
        return this.GetPendingUserIDs().indexOf(userId) != -1;
    }

    public AddToCompletBy(userId: number): void {
        if(this.ApproverIDs.indexOf(userId) != -1)
            this.CompletedBy.push(userId);
    }

    public GetPendingUserIDs(): number[] {
        let userIDs = [];

        this.ApproverIDs.map((approverID) => {
            if(this.CompletedBy.indexOf(approverID) == -1)
                userIDs.push(approverID);
        });

        return userIDs;
    }

    public async GetPendingUserEmails(): Promise<string[]> {
        const emails = [];
        
        await Promise.all(this.GetPendingUserIDs().map(async (userId) => {
            const user = await SecurityHelper.GetUserById(userId);            
            if(!CommonHelper.IsNullOrEmpty(user.Email))
                emails.push(user.Email);
        }));

        return emails;
    }
}