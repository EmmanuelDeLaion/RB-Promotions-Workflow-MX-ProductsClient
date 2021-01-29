export class PromoWorkflowState {
    public ApproverIDs: number[] = [];
    public CompletedBy: number[] = [];

    constructor(approverIDs: number[]) {
        this.ApproverIDs = approverIDs;
    }

    public IsComplete():boolean {
        return this.ApproverIDs.length == this.CompletedBy.length;
    }

    public UserCanApprove(userId: number): boolean
    {
        return this.GetCurrentApproverId() == userId;
    }

    public GetCurrentApproverId(): number
    {
        return this.ApproverIDs.length > 0 ? this.ApproverIDs.slice(this.CompletedBy.length)[0] : null;
    }
}