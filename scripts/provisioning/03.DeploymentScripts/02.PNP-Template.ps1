function CreateGroup($groupName)
{
    Try 
    {
        $group = Get-PnPGroup $groupName
    }
    Catch
    {
    }

    if($group -eq $null)
    {
        New-PnPGroup -Title $groupName
    }
}

Invoke-PnPSiteTemplate -Path "../template.xml" -Handlers Lists

CreateGroup "RB - KAMs - MX"
CreateGroup "RB - Solo consulta - MX"

CreateGroup "RB - KAMs - PR"
CreateGroup "RB - Solo consulta - PR"

CreateGroup "RB - KAMs - EC"
CreateGroup "RB - Solo consulta - EC"

CreateGroup "RB - KAMs - CO"
CreateGroup "RB - Solo consulta - CO"

CreateGroup "RB - KAMs - BR"
CreateGroup "RB - Solo consulta - BR"

CreateGroup "RB - KAMs - DR"
CreateGroup "RB - Solo consulta - DR"

CreateGroup "RB - KAMs - CR"
CreateGroup "RB - Solo consulta - CR"

CreateGroup "RB - KAMs - PU"
CreateGroup "RB - Solo consulta - PU"