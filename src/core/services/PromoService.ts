import { Promo } from "../model/Promo/Promo";
import { PromoViewModel } from "../model/Promo/PromoViewModel";
import { PromoRepository } from "../data/PromoRepository";
import { TypeRepository } from "../data/TypeRepository";
import { Type } from "../model/Common";

export class PromoService { 

  private static async GetPromo(itemId?: number): Promise<Promo> {
    return itemId ? await PromoRepository.GetById(itemId) : new Promo();
  }

  public static async GetViewModel(itemId?: number): Promise<PromoViewModel> {
    return (await this.GetPromo(itemId)).GetViewModel();
  }

  public static async Save(entity: Promo): Promise<void> {
    return (await this.GetPromo(entity.ItemId)).ExecuteAction1(entity);
  }

  public static async GetTypesByCategory(categoryId: number): Promise<Type[]> {
    return await TypeRepository.GetByCategory(categoryId);
  }
}