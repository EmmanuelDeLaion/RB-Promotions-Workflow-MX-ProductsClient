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

Apply-PnPProvisioningTemplate -Path "../template.xml" -Handlers Lists

CreateGroup "RB - KAMs - MX"
CreateGroup "RB - Solo consulta - MX"

CreateGroup "RB - KAMs - PR"
CreateGroup "RB - Solo consulta - PR"