$ErrorActionPreference = 'Stop'

$required = @('DISCORD_BOT_TOKEN', 'DISCORD_APPLICATION_ID', 'DISCORD_GUILD_ID')
foreach ($name in $required) {
  if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($name))) {
    throw "Define la variable de entorno $name antes de registrar los comandos."
  }
}

$applicationId = [Environment]::GetEnvironmentVariable('DISCORD_APPLICATION_ID')
$guildId = [Environment]::GetEnvironmentVariable('DISCORD_GUILD_ID')
$token = [Environment]::GetEnvironmentVariable('DISCORD_BOT_TOKEN')

if ($applicationId -notmatch '^\d{17,20}$' -or $guildId -notmatch '^\d{17,20}$') {
  throw 'DISCORD_APPLICATION_ID y DISCORD_GUILD_ID deben ser IDs numéricos válidos de Discord.'
}

$commands = @(
  @{
    name = 'sitio'
    description = 'Enlaces al portafolio y sus páginas'
    options = @(
      @{
        type = 3
        name = 'seccion'
        description = 'Página que quieres abrir'
        required = $true
        choices = @(
          @{ name = 'Inicio'; value = 'inicio' }
          @{ name = 'Proyectos'; value = 'proyectos' }
          @{ name = 'Perfil de staff'; value = 'staff' }
          @{ name = 'Contacto'; value = 'contacto' }
        )
      }
    )
  },
  @{
    name = 'pregunta'
    description = 'Pregunta sobre el portafolio'
    options = @(
      @{
        type = 3
        name = 'pregunta'
        description = 'Escribe una pregunta sobre el sitio'
        required = $true
        max_length = 500
      }
    )
  },
  @{
    name = 'ticket'
    description = 'Abre un canal privado de soporte'
    options = @(
      @{
        type = 3
        name = 'asunto'
        description = 'Resume brevemente el motivo del ticket'
        required = $true
        max_length = 80
      }
    )
  }
)

$headers = @{
  Authorization = "Bot $token"
  'Content-Type' = 'application/json'
}
$uri = "https://discord.com/api/v10/applications/$applicationId/guilds/$guildId/commands"
$body = ConvertTo-Json -InputObject $commands -Depth 10
$registered = Invoke-RestMethod -Method Put -Uri $uri -Headers $headers -Body $body
Write-Output ("Comandos registrados: " + (($registered | ForEach-Object { '/' + $_.name }) -join ', '))
