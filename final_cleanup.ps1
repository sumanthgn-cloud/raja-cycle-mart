$files = Get-ChildItem -Path . -Recurse -Filter *.html

foreach ($file in $files) {
    if ($file.FullName -notmatch "\\.gemini\\") {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $initialContent = $content
        $modified = $false

        # 1. Fix UTF-8 Decoding Errors (Win-1252 interpretations)
        $utf8Replacements = @{
            "â‚¹" = "₹"
            "ðŸš²" = "🚲"
            "ðŸš´" = "🚴"
            "âš¡" = "⚡"
            "ðŸ›’" = "🛒"
            "ðŸ“²" = "📲"
            "â€”" = "—"
            "â€™" = "’"
            "â€œ" = "“"
            "â€" = "”" 
            "Â" = "" # Often appears as a non-breaking space artifact
        }

        foreach ($key in $utf8Replacements.Keys) {
            if ($content -match [regex]::Escape($key)) {
                $content = $content -replace [regex]::Escape($key), $utf8Replacements[$key]
                $modified = $true
            }
        }

        # 2. Fix '?' Placeholders (Contextual)
        $contextReplacements = @{
            "Lucky Draw \?" = "Lucky Draw ✨"
            "View all \?" = "View all →"
            "Read guide \?" = "Read guide →"
            "Book inspection \?" = "Book inspection →"
            "Book this service \?" = "Book this service →"
            "View full pricing \?" = "View full pricing →"
            "Visit our shop \?" = "Visit our shop →"
            "\? Back to Blog" = "← Back to Blog"
            "approx 4.8\?" = "approx 4.8★"
            
            # List items in services.html
            "\? Gear tuning" = "• Gear tuning"
            "\? Chain, freewheel" = "• Chain, freewheel"
            "\? Rear derailleur" = "• Rear derailleur"
            "\? Brake cable" = "• Brake cable"
            "\? Wheel truing" = "• Wheel truing"
            "\? Noise, slipping" = "• Noise, slipping"
            "\? Full gear-cycle" = "• Full gear-cycle"
            
            # Checkmarks in services.html (implied by previous context)
            "\? Expert gear" = "✅ Expert gear"
            "\? Genuine accessories" = "✅ Genuine accessories"
            "\? Honest pricing" = "✅ Honest pricing"
            "\? Same-day service" = "✅ Same-day service"
            "\? Certified helmets" = "• Certified helmets"
            "\? Bells, handle" = "• Bells, handle"
            "\? Manual & foot" = "• Manual & foot"
            "\? Mobile holders" = "• Mobile holders"
            "\? Front & rear" = "• Front & rear"
            "\? Chains, freewheel" = "• Chains, freewheel"
            "\? no unnecessary" = "— no unnecessary"
            "Tumkur \? SS PURAM" = "Tumkur — SS PURAM"
            "Tumkur \? Trusted Experts" = "Tumkur — Trusted Experts"
            "1987 \? 3500\+" = "1987 · 3500+"
            "serviced \? Approx" = "serviced · Approx"
        }

        foreach ($key in $contextReplacements.Keys) {
            # Use regex replace for these specific patterns
            if ($content -match $key) {
                $content = $content -replace $key, $contextReplacements[$key]
                $modified = $true
            }
        }

        # 3. Fix '?' used as Currency Symbol (Regex)
        # Matches '?' followed immediately by a digit, e.g., ?50, ?300
        if ($content -match "\?(\d+)") {
            $content = $content -replace "\?(\d+)", "₹$1"
            $modified = $true
        }

        if ($modified) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Repaired $($file.Name)"
        }
    }
}
