-- my-auth/schema.lua
return {
  name = "my-auth",
  fields = {
    { config = {
        type = "record",
        fields = {
          { auth_url        = { type = "string", required = true }, },  -- obrigatório
          { cache_ttl       = { type = "integer", default = 20 }, },    -- opcional, default 20s
          { connect_timeout = { type = "integer", default = 2000 }, },  -- opcional
          { send_timeout    = { type = "integer", default = 2000 }, },  -- opcional
          { read_timeout    = { type = "integer", default = 3000 }, },  -- opcional
        },
      },
    },
  },
}
