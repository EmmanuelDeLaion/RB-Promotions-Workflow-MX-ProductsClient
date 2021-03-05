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

CreateGroup "RB - KAMs"
CreateGroup "RB - Solo consulta"