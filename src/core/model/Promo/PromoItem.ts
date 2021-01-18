import { Entity, LookupValue } from "../../infrastructure";
import { Category, Product, Type } from "../Common";

export class PromoItem extends Entity {
    public AdditionalID: string;
    public ShortDescription: string;
    public Category: Category;
    public Investment?: number;
    public Type: Type;
    public CappedActivity: boolean = false;
    public BusinessUnit: LookupValue;
    public Brand: LookupValue;
    public ProductCategory: LookupValue;
    public Product: Product;
    public StartDate: Date;
    public EndDate: Date;
    public DiscountPerPiece?: number;
    public NetPrice?: number;
    public COGS: number;

    public constructor(init?:Partial<PromoItem>) {
        super();
        (<any>Object).assign(this, init);
    }

    //#region Required fields

    public RequiresInvestment():boolean {
        return this.Category && this.Category.RequiresInvestment;
    }

    public RequiresDiscountPerPiece():boolean {
        return this.Category && this.Category.RequiresDiscountPerPiece;
    }

    public RequiresNetPrice():boolean {
        return this.Category && this.Category.RequiresNetPrice;
    }

    //#endregion

    //#region Calculated values

    public GetDiscountPercentage(): Number {
        //TODO: Agregar campo RequiresDiscountPercentage
        if(this.RequiresDiscountPerPiece() && this.NetPrice > 0)
            return (this.DiscountPerPiece / this.NetPrice) * 100;

        return null;    
    }

    public GetGMPercentageNR(): Number {
        if(this.NetPrice > 0)
            return ((this.NetPrice - this.COGS) / this.NetPrice) * 100;

        return null;
    }

    public GetGMPercentageNRWithPromo(): Number {
        //TODO: Agregar campo RequiresDiscountPerPiece
        if(this.RequiresDiscountPerPiece() && this.NetPrice > 0)
            return ((this.NetPrice - this.DiscountPerPiece - this.COGS) / this.NetPrice) * 100;

        return null;
    }

    public GetGMBaseUnit(): Number {
        return this.NetPrice - this.COGS;
    }

    public GetGMPromoUnit(): Number {
        return this.NetPrice - this.DiscountPerPiece - this.COGS;
    }

    //#endregion

    //#region Numbers as strings

    public InvestmentAsString():string {
        return this.Investment != null ? this.Investment.toString() : null;
    }

    public DiscountPerPieceAsString():string {
        return this.DiscountPerPiece != null ? this.DiscountPerPiece.toString() : null;
    }

    public NetPriceAsString():string {
        return this.NetPrice != null ? this.NetPrice.toFixed(2) : null;
    }

    public DiscountPercentageAsString(): string {
        const discountPercentage = this.GetDiscountPercentage();
        return discountPercentage != null ? discountPercentage.toFixed(2) : null;
    }

    public COGSAsString():string {
        return this.COGS != null ? this.COGS.toFixed(2) : null;
    }

    public GMPercentageNRAsString(): string {
        const gmPercentageNR = this.GetGMPercentageNR();
        return gmPercentageNR != null ? gmPercentageNR.toFixed(2) : null;
    }

    public GMPercentageNRWithPromoAsString(): string {
        const gmPercentageNRWithPromo = this.GetGMPercentageNRWithPromo();
        return gmPercentageNRWithPromo != null ? gmPercentageNRWithPromo.toFixed(2) : null;
    }

    public GMBaseUnitAsString(): string {
        const gmBaseUnit = this.GetGMBaseUnit();
        return gmBaseUnit != null ? gmBaseUnit.toFixed(2) : null;
    }

    public GMPromoUnitAsString(): string {
        const gmPromoUnit = this.GetGMPromoUnit();
        return gmPromoUnit != null ? gmPromoUnit.toFixed(2) : null;
    }

    //#endregion
}