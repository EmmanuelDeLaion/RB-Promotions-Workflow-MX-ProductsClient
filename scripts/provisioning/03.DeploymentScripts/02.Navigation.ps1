Get-PnPNavigationNode -Location QuickLaunch | Remove-PnPNavigationNode -Force

Add-PnPNavigationNode -Title "Inicio" -Location "QuickLaunch" -Url ""
Add-PnPNavigationNode -Title "Mis pendientes de aprobación" -Location "QuickLaunch" -Url "Lists/Promotions/Mis%20pendientes%20de%20aprobacin.aspx"
Add-PnPNavigationNode -Title "Mis promociones" -Location "QuickLaunch" -Url "Lists/Promotions/Mis%20Promociones.aspx"
Add-PnPNavigationNode -Title "Todas las promociones" -Location "QuickLaunch" -Url "Lists/Promotions/AllItems.aspx"
Add-PnPNavigationNode -Title "Reportes" -Location "QuickLaunch" -Url ""