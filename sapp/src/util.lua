--NO_IMPORTS

function getHash(playerIndex) 
    if player_present(playerIndex) then
        local hash = get_var(playerIndex, "$hash")
        return hash
    end
    return nil
end

function getName(playerIndex)
    if player_present(playerIndex) then
        local name = get_var(playerIndex, "$name")
        return name
    end
    return nil
end

function new(self, newObject)
    local newObjectInstance = newObject or {}
    setmetatable(newObjectInstance, self)
    self.__index = self
    return newObjectInstance
end