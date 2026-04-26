$phones = @(
    @{ name = "infinix-hot-50i"; url = "https://fdn2.gsmarena.com/vv/pics/infinix/infinix-hot-50i-1.jpg" },
    @{ name = "oneplus-13"; url = "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg" },
    @{ name = "samsung-galaxy-s26-plus"; url = "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-plus.jpg" },
    @{ name = "google-pixel-9-pro"; url = "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9-pro-.jpg" },
    @{ name = "google-pixel-9a"; url = "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9a.jpg" }
)

$outDir = "A:\TECHBOY-STORE\images\products\phones"

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Referer" = "https://www.gsmarena.com/"
}

foreach ($phone in $phones) {
    $outPath = "$outDir\" + $phone.name + ".jpg"
    try {
        Invoke-WebRequest -Uri $phone.url -OutFile $outPath -Headers $headers -TimeoutSec 20
        $size = (Get-Item $outPath).Length
        Write-Host ("SUCCESS: " + $phone.name + ".jpg (" + $size + " bytes)")
    } catch {
        Write-Host ("FAILED: " + $phone.name + " - " + $_.Exception.Message)
    }
}

Write-Host "`nAll phone images:"
Get-ChildItem $outDir | Format-Table Name, Length
