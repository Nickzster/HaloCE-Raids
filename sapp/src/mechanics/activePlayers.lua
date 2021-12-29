--BEGIN_IMPORT
-- import player.player end
-- import util end
--END_IMPORT

--TODO: Refactor. Use callbacks instead of player_present.

PlayerDatabase = {}

-- PlayerDatabase is a memory store that holds all of the records from Firebase.
-- It is constructed with keys being firebase id, and values being firebase entries.
-- It should be searchable and modifiable via hash only.
-- It nearly corresponds directly with the ActivePlayerList.

function PlayerDatabase.modifyHash(self, databaseID, playerHash)
    self[databaseID]['hash'] = playerHash
end

function PlayerDatabase.searchByHash(self, hash)
    for k,v in pairs(self) do
        if type(v) == "table" then
            if v['hash'] == hash then return {database_id = k, player=v} end
        end
    end
    return nil
end

function PlayerDatabase.searchByNameAndCode(self, name, code)
    for k,v in pairs(self) do
        if type(v) == "table" then
            local playerCodeToCheckFor = v['player_code']
            local playerNameToCheckFor = v['name']
            if playerCodeToCheckFor == code and playerNameToCheckFor == name then return {database_id = k, player=v} end
        end
    end
    return nil
end


ActivePlayerList = {}

-- ActivePlayerList is a memory store that holds all of an active player's information.
-- It is constructed with keys being player's hash values, and the values being Player entries.
-- It nearly corresponds directly with the PlayerDatabase, with the exception being unregistered players.

function ActivePlayerList.addPlayer(self, playerIndex)
    if player_present(playerIndex) then
        local hash = getHash(playerIndex)
        local playerName = getName(playerIndex) or "New001"
        -- Need to default to default player class if the player is unregistered.
        local playerInfo = Player
        local retrievedPlayerInfo = PlayerDatabase:searchByHash(hash)
        if hash ~= nil and retrievedPlayerInfo ~= nil then
            playerInfo = retrievedPlayerInfo['player']
        end
    
        playerLoadout = getDefaultLoadout(playerInfo['active_class_id'])
        -- playerLoadout = playerInfo['loadout'] or getDefaultLoadout(playerInfo['active_class_id'])
        self[hash] = {
            name=playerName,
            player_index = playerIndex,
            loadout = playerLoadout,
            active_class_id=playerInfo['active_class_id'],
            equipment_id=playerInfo['equipment_id'],
            version=playerInfo['version'],
            collection=playerInfo['collection'],
            player_code=playerInfo['player_code'],
        }
    end
end

function ActivePlayerList.removePlayer(self, playerIndex)
    if player_present(playerIndex) then
        local hash = getHash(playerIndex)
        if hash ~= nil then
            self[hash] = nil
        end
    end
end

function ActivePlayerList.getPlayer(self,playerIndex)
    if player_present(playerIndex) then
        local hash = getHash(playerIndex)
        if hash ~= nil then return self[hash] end
    end
end

function ActivePlayerList.getAllPlayers(self)
    local playerTable = {}
    for i=1,16 do
        if player_present(i) then
            local hash = getHash(i)
            if hash ~= nil then
                playerTable[hash] = self[hash]
            end
        end
    end
    return playerTable
end





