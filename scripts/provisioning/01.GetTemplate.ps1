$siteUrl = "https://spme.sharepoint.com/sites/RB-Promociones"
$UserName = "testuser.nine@spme.onmicrosoft.com"
$pwd = "Password1"

$Credentials = New-Object System.Management.Automation.PSCredential ($UserName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl –Credentials $Credentials

Get-PnPProvisioningTemplate -Out template.xml -Handlers Lists -ListsToExtract "Canales", "Categorías", "Clientes", "Promo items", "Promociones", "Subcanales", "Tipos"

Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Canales' -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Categorías' -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Clientes' -Query '' -Fields 'Title','Channel','Subchannel'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Subcanales' -Query '' -Fields 'Title','Channel'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Tipos' -Query '' -Fields 'Title','Category'