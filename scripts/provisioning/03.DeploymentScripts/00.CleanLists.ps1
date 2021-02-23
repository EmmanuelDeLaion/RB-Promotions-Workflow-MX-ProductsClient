function CleanList($listName)
{
    Write-Host "Starting to clean list" $listName
    $items =Get-PnPListItem -List $listName -PageSize 500

    foreach ($item in $items)
    {
        try
        {
            Remove-PnPListItem -List $listName -Identity $item.Id -Force
        }
        catch
        {
            Write-Host "Error Occurred While Deleting the Item from the SharePoint Online List"
        }
    }
}


CleanList "Aprobadores"
CleanList "Canales"
CleanList 'Categorías'
CleanList "Categorías de producto"
CleanList "Clientes"
CleanList "Configuración" 
CleanList "Marcas"
CleanList "NotificationTemplates"
CleanList "Productos"
CleanList "Productos por cliente"
CleanList "Subcanales"
CleanList "Tipos" 
CleanList "Unidades de negocio"
CleanList "Volúmenes del último año"

CleanList "EmailSender"

CleanList "Promo items"
CleanList "Promociones"
CleanList "Workflow log"