import { sp } from "@pnp/sp/presets/all";
import { ConfigurationItem} from "../model/Common/Configuration/ConfigurationItem";
import { ConfigurationKey} from "../model/Common/Configuration/ConfigurationKey";
import { Configuration} from "../model/Common/Configuration/Configuration";
import { CommonHelper } from "../common/CommonHelper";

export class ConfigurationRepository {
    private static LIST_NAME: string = "Configuración";
    private static _instance : Configuration;

    public static async GetInstance(): Promise<Configuration> {
        
        if(ConfigurationRepository._instance == null)
            ConfigurationRepository._instance = await ConfigurationRepository.GetConfiguration();
        
        return ConfigurationRepository._instance;
    }

    private static GetConfiguration(): Promise<Configuration> {

        const entity = ConfigurationRepository.GetValues().then((items) => {
                let configuration = new Configuration();
                configuration.CountryCode = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.CountryCode);
                configuration.CountryName = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.CountryName);
                configuration.CurrencySymbol = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.CurrencySymbol);
                configuration.TeamsChannelId = ConfigurationRepository.GetConfigurationValue(items, ConfigurationKey.TeamsChannelId);
                return configuration;
            });
  
        return entity;
    }
    
    private static GetConfigurationValue(items: ConfigurationItem[], key: ConfigurationKey): string
    {
        let configurationItem = items.filter(x => x.Key.toLowerCase() === key.toLowerCase())[0];

        if(configurationItem == null)
        {            
            console.log("Configuration item for key '%s' not found.", key);
            return null;
        }

        if(CommonHelper.IsNullOrEmpty(configurationItem.Value))
            console.log("Configuration value for key '%s' is empty.", key);

        return configurationItem.Value;
    }

    private static async GetValues():Promise<ConfigurationItem[]>
    {
        const collection = sp.web.lists.getByTitle(ConfigurationRepository.LIST_NAME)
            .items.select(
                "ID", 
                "Title", 
                "Value", 
            ).get().then((items) => { 
                return items.map((item) => {                     
                    return ConfigurationRepository.BuildEntity(item);
                });
            });

        return collection;
    }

    private static BuildEntity(item: any): ConfigurationItem {

        let entity = new ConfigurationItem();
  
        entity.ItemId = item.ID;
        entity.Key = item.Title;
        entity.Value = item.Value;

        return entity;
    }
}

