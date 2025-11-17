# =====================================================
# Script para executar migrations da Bíblia via Supabase CLI
# =====================================================

Write-Host "📖 Executando migrations da Bíblia no Supabase..." -ForegroundColor Cyan
Write-Host ""

# Verificar se .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Erro: Arquivo .env.local não encontrado!" -ForegroundColor Red
    exit 1
}

# Carregar variáveis do .env.local
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Construir Database URL
$SUPABASE_URL = [Environment]::GetEnvironmentVariable("VITE_SUPABASE_URL")
$SUPABASE_KEY = [Environment]::GetEnvironmentVariable("VITE_SUPABASE_ANON_KEY")
$DB_PASSWORD = [Environment]::GetEnvironmentVariable("SUPABASE_DB_PASSWORD")

if (-not $SUPABASE_URL -or -not $DB_PASSWORD) {
    Write-Host "❌ Erro: Variáveis VITE_SUPABASE_URL ou SUPABASE_DB_PASSWORD não encontradas no .env.local!" -ForegroundColor Red
    exit 1
}

# Extrair project ref do URL
$SUPABASE_URL -match "https://([a-z]+)\.supabase\.co" | Out-Null
$PROJECT_REF = $matches[1]

# Construir Database URL
$DB_URL = "postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

Write-Host "🔗 Conectando ao projeto: $PROJECT_REF" -ForegroundColor Yellow
Write-Host ""

# Obter lista de arquivos de migration ordenados
$migrationFiles = Get-ChildItem "supabase\migrations\bible-data" -Filter "*.sql" | Sort-Object Name

$total = $migrationFiles.Count
$current = 0
$errors = @()

foreach ($file in $migrationFiles) {
    $current++
    $progress = [math]::Round(($current / $total) * 100)
    
    Write-Host "[$current/$total] ($progress%) Executando: $($file.Name)" -ForegroundColor Cyan
    
    # Executar migration usando psql
    $env:PGPASSWORD = $DB_PASSWORD
    
    # Ler conteúdo do arquivo
    $sqlContent = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Executar via psql
    $result = $sqlContent | psql "$DB_URL" 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Erro ao executar $($file.Name)" -ForegroundColor Red
        $errors += $file.Name
        Write-Host "  Detalhes: $result" -ForegroundColor DarkRed
    } else {
        Write-Host "  ✅ Sucesso!" -ForegroundColor Green
    }
    
    # Pequeno delay para não sobrecarregar
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "🎉 Todas as $total migrations foram executadas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "⚠️  $($errors.Count) migrations falharam:" -ForegroundColor Yellow
    $errors | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}
Write-Host "=================================================" -ForegroundColor Cyan
