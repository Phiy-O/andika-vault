$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/login' -Method Post -Body 'email=andikapiyo12@andikavault.com&password=admin123&callbackUrl=%2Fadmin%2Fskills' -ContentType 'application/x-www-form-urlencoded' -WebSession $session -UseBasicParsing
Write-Host "Login Status:" $response.StatusCode
$response2 = Invoke-WebRequest -Uri 'http://localhost:3000/admin/skills' -WebSession $session -UseBasicParsing
Write-Host "Admin Skills Status:" $response2.StatusCode
$response2.Content | Out-File -Encoding utf8 admin-skills-main.html
Write-Host "Content saved to admin-skills-main.html"