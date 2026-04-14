$srcPath = "c:\Users\Lenovo\Desktop\AntiGravity_ShareBite\frontend\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx","*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    if ($null -eq $content) { continue }
    
    # Remove dark: variant classes (patterns like " dark:bg-dark-900/50" etc.)
    $content = $content -replace ' dark:bg-dark-\d+(\/\d+)?', ''
    $content = $content -replace ' dark:text-dark-\d+', ''
    $content = $content -replace ' dark:border-dark-\d+(\/\d+)?', ''
    $content = $content -replace ' dark:bg-transparent', ''
    $content = $content -replace ' dark:text-white', ''
    $content = $content -replace ' dark:bg-dark-[a-z0-9/]+', ''
    
    # Fix remaining dark- color tokens to light equivalents
    $content = $content -replace 'text-dark-100\b', 'text-slate-800'
    $content = $content -replace 'text-dark-200\b', 'text-slate-700'
    $content = $content -replace 'text-dark-300\b', 'text-slate-600'
    $content = $content -replace 'text-dark-400\b', 'text-slate-500'
    $content = $content -replace 'text-dark-500\b', 'text-slate-400'
    $content = $content -replace 'text-dark-50\b', 'text-slate-900'
    $content = $content -replace 'bg-dark-950\b', 'bg-slate-50'
    $content = $content -replace 'bg-dark-900\b', 'bg-white'
    $content = $content -replace 'bg-dark-800\b', 'bg-slate-100'
    $content = $content -replace 'bg-dark-700\b', 'bg-slate-200'
    $content = $content -replace 'bg-dark-800\/50', 'bg-slate-100'
    $content = $content -replace 'bg-dark-900\/50', 'bg-slate-50'
    $content = $content -replace 'bg-dark-900\/80', 'bg-white'
    $content = $content -replace 'bg-dark-900\/95', 'bg-white'
    $content = $content -replace 'border-dark-700\/50', 'border-slate-200'
    $content = $content -replace 'border-dark-800\/50', 'border-slate-200'
    $content = $content -replace 'border-dark-700\b', 'border-slate-200'
    $content = $content -replace 'border-dark-800\b', 'border-slate-200'
    $content = $content -replace 'hover:bg-dark-800\b', 'hover:bg-slate-100'
    $content = $content -replace 'hover:bg-dark-700\b', 'hover:bg-slate-200'
    $content = $content -replace 'hover:text-dark-100\b', 'hover:text-slate-800'
    $content = $content -replace 'hover:text-dark-200\b', 'hover:text-slate-700'
    $content = $content -replace 'placeholder-dark-500\b', 'placeholder-slate-400'
    $content = $content -replace 'placeholder-dark-400\b', 'placeholder-slate-300'
    $content = $content -replace 'min-h-screen bg-dark-950', 'min-h-screen bg-slate-50'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Processed: $($file.Name)"
}
Write-Host "All done!"
