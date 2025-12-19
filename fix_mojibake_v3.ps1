$files = Get-ChildItem -Path . -Recurse -Filter *.html

foreach ($file in $files) {
    if ($file.FullName -notmatch "\\.gemini\\") {
        # Read file content safely
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $initialContent = $content
        $modified = $false

        # Explicit replacements to avoid Hashtable syntax issues
        if ($content -match "Lucky Draw \?") { $content = $content -replace "Lucky Draw \?", "Lucky Draw ✨"; $modified = $true }
        if ($content -match "approx 4.8\?") { $content = $content -replace "approx 4.8\?", "approx 4.8★"; $modified = $true }
        if ($content -match "View all \?") { $content = $content -replace "View all \?", "View all →"; $modified = $true }
        if ($content -match "Read guide \?") { $content = $content -replace "Read guide \?", "Read guide →"; $modified = $true }
        if ($content -match "Book inspection \?") { $content = $content -replace "Book inspection \?", "Book inspection →"; $modified = $true }
        if ($content -match "Book this service \?") { $content = $content -replace "Book this service \?", "Book this service →"; $modified = $true }
        if ($content -match "View full pricing \?") { $content = $content -replace "View full pricing \?", "View full pricing →"; $modified = $true }
        if ($content -match "Visit our shop \?") { $content = $content -replace "Visit our shop \?", "Visit our shop →"; $modified = $true }
        
        # Dashes
        if ($content -match "Tumkur \? SS PURAM") { $content = $content -replace "Tumkur \? SS PURAM", "Tumkur — SS PURAM"; $modified = $true }
        if ($content -match "Tumkur \? Trusted Experts") { $content = $content -replace "Tumkur \? Trusted Experts", "Tumkur — Trusted Experts"; $modified = $true }
        if ($content -match "pricing \? no unnecessary") { $content = $content -replace "pricing \? no unnecessary", "pricing — no unnecessary"; $modified = $true }
        
        # Bullets
        if ($content -match "1987 \? 3500\+") { $content = $content -replace "1987 \? 3500\+", "1987 · 3500+"; $modified = $true }
        if ($content -match "serviced \? Approx") { $content = $content -replace "serviced \? Approx", "serviced · Approx"; $modified = $true }

        # Checkmarks
        if ($content -match "\? Expert gear") { $content = $content -replace "\? Expert gear", "✅ Expert gear"; $modified = $true }
        if ($content -match "\? Genuine accessories") { $content = $content -replace "\? Genuine accessories", "✅ Genuine accessories"; $modified = $true }
        if ($content -match "\? Honest pricing") { $content = $content -replace "\? Honest pricing", "✅ Honest pricing"; $modified = $true }
        if ($content -match "\? Same-day service") { $content = $content -replace "\? Same-day service", "✅ Same-day service"; $modified = $true }

        # Bullets in lists
        if ($content -match "\? Gear tuning") { $content = $content -replace "\? Gear tuning", "• Gear tuning"; $modified = $true }
        if ($content -match "\? Chain, freewheel") { $content = $content -replace "\? Chain, freewheel", "• Chain, freewheel"; $modified = $true }
        if ($content -match "\? Rear derailleur") { $content = $content -replace "\? Rear derailleur", "• Rear derailleur"; $modified = $true }
        if ($content -match "\? Brake cable") { $content = $content -replace "\? Brake cable", "• Brake cable"; $modified = $true }
        if ($content -match "\? Wheel truing") { $content = $content -replace "\? Wheel truing", "• Wheel truing"; $modified = $true }
        if ($content -match "\? Noise, slipping") { $content = $content -replace "\? Noise, slipping", "• Noise, slipping"; $modified = $true }
        if ($content -match "\? Full gear-cycle") { $content = $content -replace "\? Full gear-cycle", "• Full gear-cycle"; $modified = $true }

        if ($modified) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Repaired $($file.Name)"
        }
    }
}
