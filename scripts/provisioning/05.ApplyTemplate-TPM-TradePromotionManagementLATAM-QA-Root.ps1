$siteUrl = "https://rbcom.sharepoint.com/sites/TPM-TradePromotionManagementLATAM-QA"

Connect-PnPOnline -Url $siteUrl -UseWebLogin

Apply-PnPProvisioningTemplate -Path template.xml -Handlers Lists