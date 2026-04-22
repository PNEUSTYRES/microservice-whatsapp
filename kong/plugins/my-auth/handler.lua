local http = require "resty.http"
local cjson = require "cjson.safe"
local resty_sha256 = require "resty.sha256"
local str = require "resty.string"

local MyAuth = {
  PRIORITY = 2000,
  VERSION = "2.0"
}

-- função que chama o serviço de autenticação
local function validate_token(token, conf)
  local httpc = http.new()

  httpc:set_timeouts(
    conf.connect_timeout or 2000,
    conf.send_timeout or 2000,
    conf.read_timeout or 3000
  )

  local res, err = httpc:request_uri(conf.auth_url, {
    method = "GET",
    headers = {
      ["Authorization"] = "Bearer " .. token,
      ["Content-Type"] = "application/json"
    }
  })

  if not res then
    return nil, "auth service unreachable: " .. (err or "unknown")
  end

  if res.status ~= 200 then
    return nil, "invalid token"
  end

  if not res.body then
    return nil, "empty response"
  end

  if #res.body > 5000 then
    return nil, "response too large"
  end

  local body, decode_err = cjson.decode(res.body)
  if decode_err then
    return nil, "invalid json"
  end

  if not body or body.is_valid ~= true then
    return nil, "token not valid"
  end

  httpc:set_keepalive(60000, 100)

  return body
end

function MyAuth:access(conf)
  local auth = kong.request.get_header("authorization")
  if not auth then
    return kong.response.exit(401, { message = "Authorization header missing" })
  end

  -- extrai token Bearer corretamente
  local token = auth:match("^Bearer%s+(.+)$")
  if not token then
    return kong.response.exit(401, { message = "Invalid authorization format" })
  end

  -- hash do token para cache
  local sha256 = resty_sha256:new()
  sha256:update(token)
  local digest = sha256:final()
  local cache_key = "auth:" .. str.to_hex(digest)

  -- cache do token
  local body, err = kong.cache:get(
      cache_key,
      { ttl = conf.cache_ttl or 10 },
      function(token, conf)
          local result, err = validate_token(token, conf)
          if result and result.is_valid == true then
              return result
          end
          return nil, err
      end,
      token,
      conf
  )

  if err then
    kong.log.err("Auth validation error: ", err)
    return kong.response.exit(500, { message = "Authentication service error" })
  end

  if not body then
    return kong.response.exit(401, { message = "Invalid token" })
  end

  -- envia dados para upstream
  if body.user_id then
    kong.service.request.set_header("x-user-id", body.user_id)
  end
end

return MyAuth
