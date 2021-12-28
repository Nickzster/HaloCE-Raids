--NO_IMPORTS

function getDefaultLoadout(class)
    if class == "tank" then return {
        primaryWeaponKey='shotgun',
        secondaryWeaponKey='smg'
    }
    end

    if class == "dps" then return {
        primaryWeaponKey='assault_rifle',
        secondaryWeaponKey='magnum'
    }
    end

    if class == "ammo" then return {
        primaryWeaponKey='chaingun',
        secondaryWeaponKey='magnum'
    }
    end

    if class == "medic" then return  {
        primaryWeaponKey='plasma_rifle',
        secondaryWeaponKey='plasma_pistol'
    }
    end

    return {
        primaryWeaponKey='needler',
        secondaryWeaponKey='magnum'
    }
end