--NO_IMPORTS

ActivePlayerList = {}

LoadedPlayersList = {}

function ActivePlayerList.addPlayer(self, playerHash, playerClass)
    self[playerHash] = playerClass
    return
end

function ActivePlayerList.removePlayer(self, playerHash,playerClass)
    self[playerHash] = nil
    return
end

function ActivePlayerList.getPlayer(self,playerHash)
    return self[playerHash]
end

