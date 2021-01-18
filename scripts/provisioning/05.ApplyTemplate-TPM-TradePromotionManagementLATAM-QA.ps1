$siteUrl = "https://rbcom.sharepoint.com/sites/TPM-TradePromotionManagementLATAM-QA"

$UserName = ""
$pwd = ""

$Credentials = New-Object System.Management.Automation.PSCredential ($UserName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl –Credentials $Credentials

Apply-PnPProvisioningTemplate -Path template.xml -Handlers Lists