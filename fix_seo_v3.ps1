$baseUrl = "https://raja-cycle-mart.vercel.app/"
$files = Get-ChildItem -Path . -Recurse -Filter *.html

foreach ($file in $files) {
    if ($file.FullName -notmatch "\\.gemini\\" -and $file.Name -ne "index.html" -and $file.Name -ne "services.html") {
        $content = Get-Content $file.FullName -Raw
        $modified = $false
        
        # 1. Fix Encoding
        if ($content -notmatch "meta charset") {
            $content = $content -replace "(?i)<head>", "<head>`n  <meta charset=""UTF-8"">"
            $modified = $true
            Write-Host "Added Charset to $($file.Name)"
        }
        
        # 2. Fix Canonical
        if ($content -notmatch "rel=""canonical""") {
            $relativePath = $file.FullName.Substring($PWD.Path.Length).TrimStart("\").Replace("\", "/")
            $canonicalUrl = "$baseUrl$relativePath"
            
            # Insert before first script or </head>
            if ($content -match "</head>") {
                $content = $content -replace "(?i)</head>", "  <link rel=""canonical"" href=""$canonicalUrl"" />`n</head>"
                $modified = $true
                Write-Host "Added Canonical to $($file.Name)"
            }
        }
        
        if ($modified) {
            Set-Content $file.FullName $content -Encoding UTF8
        }
    }
}
