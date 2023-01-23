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

$Field.ClientSideComponentId = "230f7778-fc7b-4977-891c-9bb7a3fa0e50" #e710acda-bc0c-4695-8390-5229e3fc8ebf

#Apply changes
$Field.Update()
$Ctx.ExecuteQuery()

Write-host "Field Settings Updated!"
