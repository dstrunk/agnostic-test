defmodule Agnostic.Repo do
  use Ecto.Repo,
    otp_app: :agnostic,
    adapter: Ecto.Adapters.Postgres
end
