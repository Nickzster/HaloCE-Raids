--NO_IMPORTS

function getDefaultLoadout(class)
    if class == "tank" then return {
        primary_weapon_id='shotgun',
        secondary_weapon_id='smg'
    }
    end

    if class == "dps" then return {
        primary_weapon_id='assault_rifle',
        secondary_weapon_id='magnum'
    }
    end

    if class == "ammo" then return {
        primary_weapon_id='chaingun',
        secondary_weapon_id='magnum'
    }
    end

    if class == "medic" then return  {
        primary_weapon_id='plasma_rifle',
        secondary_weapon_id='plasma_pistol'
    }
    end

    return {
        primary_weapon_id='magnum',
    }
end