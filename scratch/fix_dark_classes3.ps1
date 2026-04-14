$srcPath = "c:\Users\Lenovo\Desktop\AntiGravity_ShareBite\frontend\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx","*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    if ($null -eq $content) { continue }

    # Fix primary color references that linger
    $content = $content -replace 'text-primary-600\b', 'text-green-600'
    $content = $content -replace 'text-primary-500\b', 'text-green-500'
    $content = $content -replace 'hover:text-primary-600\b', 'hover:text-green-700'
    $content = $content -replace 'hover:text-primary-700\b', 'hover:text-green-700'
    $content = $content -replace 'border-primary-500\b', 'border-green-500'
    $content = $content -replace 'border-primary-500/20', 'border-green-500/20'
    $content = $content -replace 'border-primary-500/30', 'border-green-200'
    $content = $content -replace 'ring-primary-500\b', 'ring-green-500'
    $content = $content -replace 'ring-primary-500/50', 'ring-green-500/30'
    $content = $content -replace 'ring-1 ring-primary-500', 'ring-2 ring-green-500/20'
    $content = $content -replace 'bg-primary-500/20', 'bg-green-100'
    $content = $content -replace 'bg-primary-500/10', 'bg-green-50'
    $content = $content -replace 'bg-primary-500/5', 'bg-green-50'
    $content = $content -replace 'bg-primary-400\b', 'bg-green-400'
    $content = $content -replace 'bg-primary-500\b', 'bg-green-500'
    $content = $content -replace 'hover:bg-primary-400\b', 'hover:bg-green-400'
    $content = $content -replace 'hover:bg-primary-500\b', 'hover:bg-green-500'
    $content = $content -replace 'focus:border-primary-500', 'focus:border-green-500'
    $content = $content -replace 'border-primary-500 bg-primary-500/10', 'border-green-500 bg-green-50'
    
    # Fix accent color references  
    $content = $content -replace 'bg-accent-500/10', 'bg-amber-50'
    $content = $content -replace 'bg-accent-500/20', 'bg-amber-100'
    $content = $content -replace 'text-accent-400\b', 'text-amber-500'
    $content = $content -replace 'text-accent-500\b', 'text-amber-600'
    
    # Fix glass panel still in admin/ngo
    $content = $content -replace '"glass rounded-xl"', '"bg-white rounded-2xl border border-slate-200 shadow-soft"'
    $content = $content -replace '"glass rounded-xl p-6"', '"bg-white rounded-2xl border border-slate-200 shadow-soft p-6"'
    $content = $content -replace '"glass rounded-xl p-4"', '"bg-white rounded-2xl border border-slate-200 shadow-soft p-4"'
    $content = $content -replace '"glass p-8 rounded-3xl border border-primary-500/20', '"bg-green-50/50 rounded-3xl border-2 border-green-200 p-8'
    $content = $content -replace '"glass p-8 md:p-10 rounded-3xl border border-gray-200 bg-white/50"', '"bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-10"'
    $content = $content -replace '"glass p-16 rounded-3xl text-center border border-primary-500/20 bg-white/50 dark:bg-transparent"', '"bg-green-50 rounded-3xl text-center border-2 border-green-200 p-16"'
    
    # Fix text-dark-* -> text-dark-* = light text colors (absolute final pass)
    $content = $content -replace '\btext-dark-\d+\b', 'text-slate-600'
    
    # Fix bg-dark-* = light bg colors  
    $content = $content -replace '\bbg-dark-\d+(\/\d+)?\b', 'bg-white'
    
    # Remove remaining dark: prefixed classes
    $content = $content -replace ' dark:[a-z-]+(\/\d+)?', ''
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}
Write-Host "Pass 3 complete!"
