
function CreateList($clientName) {
  try {
    $listName = "ZProd - " + $clientName
    $clientList = Get-PnPList $listName
    if ($null -eq $clientList) {
      Write-Host "Create List: " $listName
      Invoke-PnPSiteTemplate -Path "../ClientProductsLists.xml" -Handlers Lists -Parameters @{"ListTitle" = $listName; }
    }
    Else {
      Write-Host "List: " $listName " already exists"
    }
  }
  catch {
    Write-Host "Error"
  }
}

$arrayNames = @(
  'AXA.COM'
  'DEP. DE DROGAS PROFESIONAL S.A.'
  'ETICOS'
  'ETICOS SERRANO GOMEZ LTDA VALLEDUPAR'
  'ETICOS SERRANO GOMEZ LTDA VALLEDUPAR.COM'
  'EVE'
  'FARMATODO.COM'
  'MERCADO ZAPATOCA'
  'PANDAPAN DISTRIBUCIONES SAS'
  'PASTEUR'
  'PASTEUR.COM'
  'PASTOR JULIO DELGADO'
  'PEPE_GANGA'
  'PRICESMART'
  'QUQO'
  'RAPIPHARMA'
  'RIDDHI PHARMA'
  'ROMA'
  'SALAMANCA RAFAEL ANTONIO'
  'SOFT-COCINA'
  'SURTILIDER'
  'TEATE COLOMBIA'
  'TestCustomer'
  'ULEX'
  'UNIDROGAS'
  'UNIDROGAS.COM'
  'VIRREY SOLIS IPS'
  'VIVEL'
  'YANETH PATRICIA FUERTES MEJIA'
)

Foreach($nameList in $arrayNames){
  CreateList $nameList
}

