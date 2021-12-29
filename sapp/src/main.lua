--BEGIN_IMPORT
-- import globals.globals end
-- import util end
-- import mechanics.activePlayers end
-- import classes.behaviors.defaults end
-- import player.player end
-- import util.file end
-- import util.json end
--END_IMPORT

TEST_CLASS="dps"

function OnScriptLoad()
    print(table.concat or "table.concat is NIL!")
    print('\nLoading Script...\n')
    register_callback(cb['EVENT_COMMAND'], "handleCommand")
    register_callback(cb['EVENT_JOIN'], "handleJoin")
    register_callback(cb['EVENT_LEAVE'], "handleLeave")
    register_callback(cb['EVENT_DAMAGE_APPLICATION'], "handleDamage")
    register_callback(cb['EVENT_OBJECT_SPAWN'], "handleObjectSpawn")
    register_callback(cb['EVENT_SPAWN'], "handleSpawn")
    register_callback(cb['EVENT_TICK'], "handleTick")
    register_callback(cb['EVENT_DIE'], "handlePlayerDie")
    register_callback(cb['EVENT_AREA_ENTER'], "handleAreaEnter")
    register_callback(cb['EVENT_AREA_EXIT'], "handleAreaExit")
    register_callback(cb['EVENT_PRESPAWN'], "handlePrespawn")
    register_callback(cb['EVENT_GAME_END'],"handleGameEnd")
    register_callback(cb['EVENT_GAME_START'], "handleGameStart")
    
    local configTable = readConfigFile('config.json')
    local playersConfig = configTable['players']
    local tagsConfig = configTable['tags']

    -- Need to extract the 'player' table from each element in playersConfig
    for key,value in pairs(playersConfig) do
        local playerEntry = playersConfig[key]
        local playerObject = playerEntry['player']
        local database_id = playerEntry['firebase_id']
        PlayerDatabase[database_id] = playerObject
    end

    -- Need to extract the 'tag' table from each element in playersConfig
    for key, value in pairs(tagsConfig) do
        local tagEntry = tagsConfig[key]
        local tagObject = tagEntry['tag']
        print(tagObject.key .. "\t" .. tagObject.ref)
        TAGS_LIST[tagObject.key] = tagObject
    end

    for i=1,16 do
        ActivePlayerList:addPlayer(i)
    end
    execute_command('kill *')
end

function OnScriptUnload()


end

function OnError(message)
    print("ERROR: " .. message)
end

OnGameStart = OnScriptLoad
OnGameEnd = OnScriptUnload

function handleAreaEnter(playerIndex, areaEntered) 
end

function handleAreaExit(playerIndex, areaExited) 
end

--TODO: Dequeue ultimate if player dies
function handlePlayerDie(playerIndex, causer)
end

function handleDamage(damagedPlayerIndex, attackingPlayerIndex, damageTagId, Damage, CollisionMaterial, Backtap)
end

function handleTick()
end

function handleObjectSpawn(playerIndex, tagId, parentObjectId, newObjectId)
end


function handlePrespawn(playerIndex)
end

function handleSpawn(playerIndex)
    local playerMemoryLocation = get_dynamic_player(playerIndex)
    local playerClass = ActivePlayerList:getPlayer(playerIndex)
    execute_command('wdel ' .. playerIndex .. ' 5')

    local primaryWeaponID=playerClass['loadout']['primary_weapon_id']
    local secondaryWeaponID=playerClass['loadout']['secondary_weapon_id']

    local primaryWeaponRef=nil
    local secondaryWeaponRef=nil
    
    if primaryWeaponID ~= nil then
        primaryWeaponRef = TAGS_LIST[primaryWeaponID]['ref']
    end

    if secondaryWeaponID ~= nil then
        secondaryWeaponRef = TAGS_LIST[secondaryWeaponID]['ref']
    end

    if secondaryWeaponRef then
        assign_weapon(spawn_object("weap", secondaryWeaponRef), tonumber(playerIndex))
    end

    if primaryWeaponRef then
        assign_weapon(spawn_object("weap", primaryWeaponRef), tonumber(playerIndex))
    end
end


function handleJoin(playerIndex)
    ActivePlayerList:addPlayer(playerIndex)
end


function handleLeave(playerIndex) 
    ActivePlayerList:removePlayer(playerIndex)
end


function handleCommand(playerIndex, Command, Env, RconPassword ) --number, string, number, string
    if player_present(playerIndex) then
        local args = {}

        for w in Command:lower():gmatch("%w+") do 
            args[#args+1] = w 
        end

        if args[1] == "dumphash" then
            print(playerIndex .. " | " .. getName(playerIndex) .. " | " .. getHash(playerIndex))
            return false
        end

        if args[1] == "dumpdeltafile" then
            writeFile(ActivePlayerList:getAllPlayers())
            return false
        end

        if args[1] == "register" then
            local playerName = getName(playerIndex)
            local playerHash = getHash(playerIndex)
            local playerCode = tonumber(args[2])

            if PlayerDatabase:searchByHash(playerHash) ~= nil then say(playerIndex, "You are already registered!") return false end

            local foundPlayer = PlayerDatabase:searchByNameAndCode(playerName, playerCode)

            if foundPlayer ~= nil then
                say(playerIndex, "You have successfully been registered.")
                PlayerDatabase:modifyHash(foundPlayer['database_id'], playerHash)
                ActivePlayerList:removePlayer(playerIndex)
                ActivePlayerList:addPlayer(playerIndex)
                execute_command('kill ' .. playerIndex)
                return false
            end

            say(playerIndex, "Failed to register!")

            return false
        end

    end

    return true
end

function handleGameStart() end

function handleGameEnd() 

end