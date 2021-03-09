#Load SharePoint CSOM Assemblies
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.dll"
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.Runtime.dll"
 
#Set Config Parameters

#$SiteURL = "https://sgiovannini.sharepoint.com/sites/RB-Promociones/Peru"
$SiteURL = "https://sgiovannini.sharepoint.com/sites/RB-Promociones/Mexico"
#$SiteURL = "https://sgiovannini.sharepoint.com/sites/RB-Promociones/"

#$SiteURL = "https://devbf2019.sharepoint.com/sites/RBPromociones/"
#$SiteURL = "https://devbf2019.sharepoint.com/sites/RBPromociones/Mexico"
#$SiteURL = "https://devbf2019.sharepoint.com/sites/RBPromociones/Peru"

#$SiteURL = "https://rbcom.sharepoint.com/sites/TPM-TradePromotionManagementLATAM-QA/Root"
#$SiteURL = "https://rbcom.sharepoint.com/sites/TPM-TradePromotionManagementLATAM-QA/Mexico"
#$SiteURL = "https://rbcom.sharepoint.com/sites/TPM-TradePromotionManagementLATAM-QA/Peru"

$ListName="Promociones"
$FieldName="Liga" #Internal Name
 
#Get Credentials to connect
$Cred = Get-Credential
 
#Setup the context
$Ctx = New-Object Microsoft.SharePoint.Client.ClientContext($SiteURL)
$Ctx.Credentials = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($Cred.Username, $Cred.Password)
 
#Get the List
$List=$Ctx.Web.Lists.GetByTitle($ListName)
 
#Get the List Field
$Field=$List.Fields.GetByInternalNameOrTitle($FieldName)
$Ctx.Load($Field)
$Ctx.ExecuteQuery()

$Field.ClientSideComponentId = "e710acda-bc0c-4695-8390-5229e3fc8eaf" 
 
#Apply changes
$Field.Update()
$Ctx.ExecuteQuery()
 
Write-host "Field Settings Updated!"