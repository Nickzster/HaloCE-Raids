--NO_IMPORTS

Array = {}

function Array.new(self, o)
    local newObjectInstance = o or {}
    setmetatable(newObjectInstance, self)
    self.__index = self
    return newObjectInstance
end

function Array.push(self,newItem)
    local length = #self

    if length == 0 then
        self[1]=newItem
        return self
    end
    self[length+1]=newItem
    return self
end

function Array.access(self, index)
    return self[index]
end

function Array.length(self)
    local count = 0
    for k,v in pairs(self) do
        if type(v) ~= "function" then count = count + 1 end
    end
    return count
end