$ListName="Promociones"
$FieldName="PromoLink" #Internal Name
 
#Setup the context
$Ctx = Get-PnPContext

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