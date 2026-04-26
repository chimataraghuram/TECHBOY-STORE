# Parse phone names and details from the document XML
$xml = Get-Content 'A:\TECHBOY-STORE\temp_docx\word\document.xml' -Raw

# Extract all plain text
$text = $xml -replace '<[^>]+>', ''
$text = [System.Net.WebUtility]::HtmlDecode($text)

# Show first 5000 chars of text
Write-Host $text.Substring(0, [Math]::Min(5000, $text.Length))
