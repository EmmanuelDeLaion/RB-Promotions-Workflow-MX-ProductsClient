$siteUrl = "https://sgiovannini.sharepoint.com/sites/RB-Promociones"
$UserName = "administrator@sgiovannini.onmicrosoft.com"
$pwd = "Spdevteam3"

$Credentials = New-Object System.Management.Automation.PSCredential ($UserName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl –Credentials $Credentials

Apply-PnPProvisioningTemplate -Path template.xml -Handlers Lists