# Portfolyo React Projesi

Modern React ve TypeScript ile geliştirilmiş portfolyo web sitesi.

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
bun install

# Geliştirme sunucusunu başlat
bun run dev

# Production build
bun run build

# GitHub Pages'e deploy et
bun run deploy
```

## 📦 GitHub Pages Deployment

Bu proje GitHub Pages'te yayınlanabilir. Deployment için:

1. **Repository'yi GitHub'a push edin**
2. **GitHub repository ayarlarında:**
   - Settings → Pages
   - Source: "Deploy from a branch" seçin
   - Branch: `gh-pages` seçin
   - Save'e tıklayın

3. **Deploy edin:**
   ```bash
   bun run deploy
   ```

4. **Site yayınlanacak:** `https://[kullanıcı-adınız].github.io/portfolyo_react/`

## 🛠️ Teknolojiler

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Firebase

## 📁 Proje Yapısı

```
src/
├── pages/          # Sayfa bileşenleri
├── assets/         # Statik dosyalar
├── lib/           # Yardımcı kütüphaneler
└── App.tsx        # Ana uygulama
```
