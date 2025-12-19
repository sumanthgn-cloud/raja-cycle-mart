$baseUrl = "https://raja-cycle-mart.vercel.app/"
$blogFiles = Get-ChildItem -Path "blog" -Filter *.html

foreach ($file in $blogFiles) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Check for head and missing charset
    if ($content -match "<head>" -and $content -notmatch "meta charset") {
        $relativePath = "blog/" + $file.Name
        $canonicalUrl = "$baseUrl$relativePath"
        
        $newHead = "<head>`n  <meta charset=""UTF-8"">`n  <link rel=""canonical"" href=""$canonicalUrl"" />"
        
        # Replace only the head tag
        $content = $content -replace "<head>", $newHead
        $modified = $true
        Write-Host "Fixed $($file.Name)"
    }
    
    if ($modified) {
        Set-Content $file.FullName $content -Encoding UTF8
    }
}
