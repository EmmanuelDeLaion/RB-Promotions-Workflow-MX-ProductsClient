$siteUrl = "https://devbf2019.sharepoint.com/sites/RBPromociones"
$UserName = "adminshp@devbf2019.onmicrosoft.com"
$pwd = "baufest_123"

$Credentials = New-Object System.Management.Automation.PSCredential ($UserName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl –Credentials $Credentials

Apply-PnPProvisioningTemplate -Path template.xml -Handlers Lists