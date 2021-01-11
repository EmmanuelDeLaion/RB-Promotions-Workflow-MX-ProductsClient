$siteUrl = "https://devbf2019.sharepoint.com/sites/RBPromociones"

#Admin
#$UserName = "adminshp@devbf2019.onmicrosoft.com"
#$pwd = "baufest_123"

#User
$UserName = "baufest1@devbf2019.onmicrosoft.com"
$pwd = "test_123"

$Credentials = New-Object System.Management.Automation.PSCredential ($UserName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl –Credentials $Credentials

Apply-PnPProvisioningTemplate -Path template.xml -Handlers Lists