-- BEGIN_IMPORT
-- import util end
-- END_IMPORT

Player = {
    name="New001",
    hash="qwertyuiopasdfghjklzxcvbnm",
    active_class_id="dps",
    equipment_id=nil,
    version="mnbvcxzlkjhgfdsapoiuytrewq",
    player_index=-1,
    loadout = {
        primary_weapon_id="assault_rifle",
        secondary_weapon_id="magnum"
    },
    collection = {
        [0]="magnum",
        [1]="assault_rifle",
        [2]="chaingun",
        [3]="plasma_rifle",
        [4]="plasma_pistol",
        [5]="shotgun",
        [6]="smg"
    },
    player_code="999999",
}

function newPlayer(self, playerObject)
    local newPlayerInstance = new(self,playerObject)
    return newPlayerInstance
end 





