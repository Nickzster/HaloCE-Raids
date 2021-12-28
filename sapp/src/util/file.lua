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