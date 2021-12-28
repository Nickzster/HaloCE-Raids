-- BEGIN_IMPORT
-- import util end
-- END_IMPORT

TankSchema = {
    name="Tank",
    cooldown=0,
    ultCooldownTime = 100
}

function newTank(self, tankObject)
    local newTankClassInstance = nil
    if tankObject ~= nil then return new(self,tankObject) end
    return new(TankSchema)
end
