--BEGIN_IMPORT
-- import util.json end
--END_IMPORT

function readConfigFile(fileName)
    local file = io.open(fileName)
    local jsonString = ""
    if file ~= nil then 
        jsonString = file:read("*a")
        table = json.decode(jsonString)
        file:close()
        return table
    end
    print("Failed to read config file!\n")
    return nil
end

function writeFile(dataToWrite, fileName)
    local currentTime = os.time(os.date("!*t"))
    local outFileName = "raids." .. currentTime .. ".postgame"
    if fileName ~= nil then outFileName = fileName end
    print("Writing file " .. outFileName .. "\n")
    local file = io.open(outFileName, "w")
    if file ~= nil then
        local encodedJSONData = json.encode(dataToWrite)     
        file:write(encodedJSONData)
    end
    file:close()
end