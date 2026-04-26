$pubDir = "A:\TECHBOY-STORE\public\images\phones"
$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Referer" = "https://www.gsmarena.com/"
}
# Try different name variants
$tries = @(
    @{ name = "iqoo-neo-10r"; url = "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-iqoo-neo-10-1.jpg" },
    @{ name = "iqoo-neo-10r"; url = "https://fdn2.gsmarena.com/vv/pics/vivo/vivo-iqoo-neo7-1.jpg" },
    @{ name = "samsung-galaxy-s25"; url = "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-plus-1.jpg" },
    @{ name = "samsung-galaxy-s25"; url = "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-1.jpg" }
)
foreach ($t in $tries) {
    $pubPath = "$pubDir\" + $t.name + ".jpg"
    if ((Test-Path $pubPath) -and (Get-Item $pubPath).Length -gt 20000) { Write-Host ("ALREADY OK: " + $t.name); continue }
    try {
        Invoke-WebRequest -Uri $t.url -OutFile $pubPath -Headers $headers -TimeoutSec 10
        $size = (Get-Item $pubPath).Length
        if ($size -gt 5000) { Write-Host ("OK: " + $t.name + " from " + $t.url) } 
        else { Write-Host ("TOO SMALL: " + $t.name) }
    } catch { Write-Host ("FAIL: " + $t.url) }
}
Write-Host ("Total: " + (Get-ChildItem $pubDir).Count)
