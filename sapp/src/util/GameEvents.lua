-- BEGIN_IMPORT
-- import util.Array end
-- import util.file end
-- END_IMPORT

GameEvents = {}

function writeGameEventsToFile()
    local gameEventString = ""
    print("Printing GameEvents table!")
    for i,v in pairs(GameEvents) do
        if type(v) == "table" then
            for j, args in pairs(v) do
                if j == 1 then 
                    gameEventString = gameEventString .. args .. ":"
                else
                    gameEventString = gameEventString .. args .. ","
                end
            end
            gameEventString = string.sub(gameEventString, 1, -2)
            gameEventString = gameEventString .. "|"
        end
    end
    if gameEventString == "" then print("Skipping write file...") return end
    gameEventString = string.sub(gameEventString, 1, -2)
    writeFile(gameEventString)
end
