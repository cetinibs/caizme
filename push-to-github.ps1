# GitHub kullanıcı bilgilerini ayarla
git config --local user.email "cetinpim@gmail.com"
git config --local user.name "Cetin Kaya"

# Tüm değişiklikleri ekle
git add .

# Değişiklikleri commit et
git commit -m "İstatistik sayaçları düzeltildi ve Next.js sürümü güncellendi"

# GitHub deposunu ekle (GitHub'da depo oluşturduğunuzda bu URL'yi değiştirin)
git remote add origin https://github.com/cetinibs/caizme.git

# Main branch'e push et
git push -u origin main

Write-Host "GitHub'a push işlemi tamamlandı!"
