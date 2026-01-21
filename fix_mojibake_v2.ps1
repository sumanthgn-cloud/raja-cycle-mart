$files = Get-ChildItem -Path . -Recurse -Filter *.html

foreach ($file in $files) {
    if ($file.FullName -notmatch "\\.gemini\\") {
        # Read as string
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $initialContent = $content
        $modified = $false

        # Define replacements in a Hashtable for safer logic
        $replacements = @{
            "Lucky Draw \?"             = "Lucky Draw ✨"
            "approx 4.8\?"              = "approx 4.8★"
            "View all \?"               = "View all →"
            "Read guide \?"             = "Read guide →"
            "Book inspection \?"        = "Book inspection →"
            "Book this service \?"      = "Book this service →"
            "View full pricing \?"      = "View full pricing →"
            "Visit our shop \?"         = "Visit our shop →"
            "Tumkur \? SS PURAM"        = "Tumkur — SS PURAM"
            "Tumkur \? Trusted Experts" = "Tumkur — Trusted Experts"
            "pricing \? no unnecessary" = "pricing — no unnecessary"
            "1987 \? 3500\+"            = "1987 · 3500+"
            "serviced \? Approx"        = "serviced · Approx"
            "\? Expert gear"            = "✅ Expert gear"
            "\? Genuine accessories"    = "✅ Genuine accessories"
            "\? Honest pricing"         = "✅ Honest pricing"
            "\? Same-day service"       = "✅ Same-day service"
            "\? Gear tuning"            = "• Gear tuning"
            "\? Chain, freewheel"       = "• Chain, freewheel"
            "\? Rear derailleur"        = "• Rear derailleur"
            "\? Brake cable"            = "• Brake cable"
            "\? Wheel truing"           = "• Wheel truing"
            "\? Noise, slipping"        = "• Noise, slipping"
            "\? Full gear-cycle"        = "• Full gear-cycle"
        }

        foreach ($key in $replacements.Keys) {
            if ($content -match $key) {
                $content = $content -replace $key, $replacements[$key]
                $modified = $true
            }
        }

        if ($modified) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Repaired $($file.Name)"
        }
    }
}
