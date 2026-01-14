$files = Get-ChildItem -Path . -Recurse -Filter *.html

foreach ($file in $files) {
    if ($file.FullName -notmatch "\\.gemini\\") {
        $content = Get-Content $file.FullName -Raw
        $initialContent = $content
        
        # Replacements based on User Feedback and Common Knowledge
        # "Lucky Draw ?" -> "Lucky Draw ✨"
        $content = $content -replace "Lucky Draw \?", "Lucky Draw ✨"
        
        # "approx 4.8?" -> "approx 4.8★"
        $content = $content -replace "approx 4.8\?", "approx 4.8★"
        
        # "View all ?" -> "View all →"
        $content = $content -replace "View all \?", "View all →"
        $content = $content -replace "Read guide \?", "Read guide →"
        $content = $content -replace "Book inspection \?", "Book inspection →"
        $content = $content -replace "Book this service \?", "Book this service →"
        $content = $content -replace "View full pricing \?", "View full pricing →"
        
        # Em Dash: "Tumkur ?" -> "Tumkur —" (context dependent, try specific patterns)
        $content = $content -replace "Tumkur \? SS PURAM", "Tumkur — SS PURAM" 
        $content = $content -replace "Tumkur \? Trusted Experts", "Tumkur — Trusted Experts"
        $content = $content -replace "pricing \? no unnecessary", "pricing — no unnecessary"
        
        # Bullet/Separator dots? "1987 ? 3500+" -> "1987 · 3500+"
        $content = $content -replace "1987 \? 3500\+", "1987 · 3500+"
        $content = $content -replace "serviced \? Approx", "serviced · Approx"
         
        # Checkmark / Bullet
        # "? Expert gear" -> "• Expert gear" or "✓ Expert gear" (User: "? Expert gear cycle repair & tuning")
        # Likely Checkmarks
        $content = $content -replace "\? Expert gear", "✅ Expert gear"
        $content = $content -replace "\? Genuine accessories", "✅ Genuine accessories"
        $content = $content -replace "\? Honest pricing", "✅ Honest pricing"
        $content = $content -replace "\? Same-day service", "✅ Same-day service"

        # List items in Services
        $content = $content -replace "\? Gear tuning", "• Gear tuning"
        $content = $content -replace "\? Chain, freewheel", "• Chain, freewheel"
        $content = $content -replace "\? Rear derailleur", "• Rear derailleur"
        $content = $content -replace "\? Brake cable", "• Brake cable"
        $content = $content -replace "\? Wheel truing", "• Wheel truing"
        $content = $content -replace "\? Noise, slipping", "• Noise, slipping"
        $content = $content -replace "\? Full gear-cycle", "• Full gear-cycle"

        # Check for any remaining likely errors in text
        $content = $content -replace "Tumkur \? Trusted Experts", "Tumkur — Trusted Experts"


        if ($content -ne $initialContent) {
            Set-Content $file.FullName $content -Encoding UTF8
            Write-Host "Repaired $($file.Name)"
        }
    }
}
