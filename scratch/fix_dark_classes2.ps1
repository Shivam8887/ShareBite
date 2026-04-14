$srcPath = "c:\Users\Lenovo\Desktop\AntiGravity_ShareBite\frontend\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx","*.tsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    if ($null -eq $content) { continue }

    # Fix remaining bg-dark / text-dark that weren't caught before
    $content = $content -replace '\bbg-dark-950\b', 'bg-slate-50'
    $content = $content -replace '\bbg-dark-900\b', 'bg-white'
    $content = $content -replace '\bbg-dark-800\b', 'bg-slate-100'
    $content = $content -replace '\bbg-dark-700\b', 'bg-slate-200'
    $content = $content -replace 'bg-dark-800/50', 'bg-slate-50'
    $content = $content -replace 'bg-dark-900/50', 'bg-slate-50'
    $content = $content -replace 'bg-dark-700/50', 'bg-slate-100'
    $content = $content -replace 'bg-dark-950/50', 'bg-slate-50'
    
    # Fix gradient buttons to green
    $content = $content -replace 'from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400', 'bg-green-500 hover:bg-green-600 from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
    $content = $content -replace 'bg-gradient-to-r from-primary-600 to-primary-500', 'bg-green-500 hover:bg-green-600'
    $content = $content -replace 'shadow-primary-500/20', 'shadow-green'
    
    # Update glass panels in dashboards to white cards
    $content = $content -replace '"glass rounded-xl p-6"', '"bg-white rounded-2xl border border-slate-200 shadow-soft p-6"'
    $content = $content -replace '"glass rounded-xl p-4"', '"bg-white rounded-2xl border border-slate-200 shadow-soft p-4"'
    $content = $content -replace '"glass rounded-xl p-5"', '"bg-white rounded-2xl border border-slate-200 shadow-soft p-5"'
    $content = $content -replace '"glass rounded-2xl p-8"', '"bg-white rounded-3xl border border-slate-100 shadow-card p-8"'
    $content = $content -replace '"glass p-8 rounded-3xl border border-gray-200', '"bg-white rounded-3xl border border-slate-200 shadow-soft p-8'
    $content = $content -replace '"glass p-6 rounded-2xl border border-gray-200', '"bg-white rounded-2xl border border-slate-200 shadow-soft p-6'
    
    # Fix remaining dark blue/green gradient text that may be hard to read
    $content = $content -replace 'text-primary-400', 'text-green-600'
    $content = $content -replace 'text-primary-300', 'text-green-500'
    $content = $content -replace 'hover:text-primary-300', 'hover:text-green-500'
    $content = $content -replace 'hover:text-primary-400', 'hover:text-green-600'
    
    # Fix remaining gray-based text that might be from old dark-mode approach
    $content = $content -replace '\btext-dark-50\b', 'text-slate-900'
    $content = $content -replace '\btext-dark-100\b', 'text-slate-800'
    $content = $content -replace '\btext-dark-200\b', 'text-slate-700'
    $content = $content -replace '\btext-dark-300\b', 'text-slate-600'
    $content = $content -replace '\btext-dark-400\b', 'text-slate-500'
    $content = $content -replace '\btext-dark-500\b', 'text-slate-400'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}
Write-Host "Pass 2 done!"
