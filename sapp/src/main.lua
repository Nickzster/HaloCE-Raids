--BEGIN_IMPORT
-- import globals.globals end
-- import util end
-- import mechanics.activePlayers end
-- import player.player end
-- import classes.behaviors.defaults end
-- import util.file end
-- import util.json end
--END_IMPORT

TEST_CLASS="dps"

function OnScriptLoad()
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
    register_callback(cb['EVENT_GAME_END'],"OnGameEnd")
    register_callback(cb['EVENT_GAME_START'], "OnGameStart")
    local configTable = readConfigFile('config.json')
    local playersConfig = configTable['players']
    local tagsConfig = configTable['tags']

    for key,value in pairs(playersConfig) do
        LoadedPlayersList[key] = value
    end

    for key, value in pairs(tagsConfig) do
        TAGS_LIST[key] = value
    end

    for i=1,16 do
        local hash = getHash(i)
        if hash ~= nil then
            playerInfo = LoadedPlayersList[hash] or Player
            ActivePlayerList:addPlayer(hash, newPlayer({
                playerIndex=i,
                loadout=getDefaultLoadout(playerInfo['class']),
                class=playerInfo['class'],
                damage=0,
                equipment=nil

            }))
        end
    end
    execute_command('kill *')
end

function OnScriptUnload()
    print('\nUnloading Script...\n')
    for i=1,16 do
        local hash = getHash(i)
        if hash ~= nil then 
            ActivePlayerList:removePlayer(hash)
        end
    end

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
    local playerClass = ActivePlayerList:getPlayer(getHash(playerIndex))
    execute_command('wdel ' .. playerIndex .. ' 5')

    local primaryWeaponKey=playerClass['loadout']['primaryWeaponKey']
    local secondaryWeaponKey=playerClass['loadout']['secondaryWeaponKey']

    local primaryWeaponRef=nil
    local secondaryWeaponRef=nil
    
    if primaryWeaponKey ~= nil then
        primaryWeaponRef = TAGS_LIST[primaryWeaponKey]['ref']
    end

    if secondaryWeaponKey ~= nil then
        secondaryWeaponRef = TAGS_LIST[secondaryWeaponKey]['ref']
    end

    assign_weapon(spawn_object("weap", secondaryWeaponRef), tonumber(playerIndex))
    assign_weapon(spawn_object("weap", primaryWeaponRef), tonumber(playerIndex))
end


function handleJoin(playerIndex)
    local hash = getHash(playerIndex)
    if hash~= nil then
       ActivePlayerList:addPlayer(hash, newPlayer({
           playerIndex=i,
           loadout=getDefaultLoadout(TEST_CLASS),
           class=TEST_CLASS,
           damage=0,
           equipment=nil

       }))
   end
end


function handleLeave(playerIndex) 
   local hash = getHash(playerIndex)
   if hash ~= nil then
       ActivePlayerList:removePlayer(hash)
   end
end


function handleCommand(playerIndex, Command, Env, RconPassword ) --number, string, number, string
    if Command == "dumphash" then
        print(playerIndex .. " | " .. getName(playerIndex) .. " | " .. getHash(playerIndex))
    end
    return true
end