# 🚀 Modern Portfolyo Web Sitesi

React 19, TypeScript ve modern web teknolojileri ile geliştirilmiş, tamamen responsive ve etkileşimli kişisel portfolyo web sitesi.

## ✨ Özellikler

### 🎨 **Modern Tasarım & Animasyonlar**
- **Framer Motion** ile akıcı animasyonlar ve geçişler
- **Tailwind CSS** ile responsive tasarım sistemi
- Gradient arka planlar ve glassmorphism efektleri
- Typing animasyonu ve hover etkileşimleri
- Smooth scroll navigasyon

### 📱 **Tam Responsive**
- Mobil-first yaklaşım
- Tablet ve desktop optimizasyonu
- Hamburger menü (mobil)
- Adaptive layout sistemi

### 🔥 **Performans & SEO**
- **Vite** ile hızlı build ve hot reload
- Code splitting ve lazy loading
- Optimized bundle size
- TypeScript ile tip güvenliği

### 📝 **Blog Sistemi**
- **Firebase** entegrasyonu
- Google Authentication
- Admin paneli (yazı oluşturma/düzenleme/silme)
- Real-time veri senkronizasyonu
- Arama ve filtreleme

### 🎯 **Portfolyo Bölümleri**
- **Hero Section**: Typing animasyonu ve gradient efektler
- **Hakkımda**: Zaman çizelgesi ve deneyim kartları
- **Yetenekler**: Animasyonlu progress barlar
- **Projeler**: 3D hover efektleri ile proje kartları
- **İletişim**: Sosyal medya linkleri

## 🛠️ Teknoloji Stack'i

### **Frontend**
- **React 19** - Modern React hooks ve concurrent features
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Vite** - Hızlı build tool ve dev server
- **React Router DOM** - Client-side routing

### **Styling & Animasyon**
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **PostCSS** - CSS processing

### **Backend & Database**
- **Firebase 12.x** - Authentication ve Firestore database
- **Google Auth** - Sosyal medya girişi

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript specific rules
- **Bun** - Fast package manager ve runtime

### **Deployment**
- **GitHub Pages** - Static site hosting
- **gh-pages** - Automated deployment

## 🚀 Kurulum ve Çalıştırma

### **Gereksinimler**
- Node.js 18+ veya Bun
- Git

### **1. Projeyi Klonlayın**
```bash
git clone https://github.com/UgurOz1/portfolyo_react.git
cd portfolyo_react
```

### **2. Bağımlılıkları Yükleyin**
```bash
# Bun ile (önerilen)
bun install

# veya npm ile
npm install
```

### **3. Environment Variables**
```bash
# .env.example dosyasını .env olarak kopyalayın
cp " .env.example" .env
```

Firebase konfigürasyonunu `.env` dosyasına ekleyin:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **4. Geliştirme Sunucusunu Başlatın**
```bash
bun run dev
# veya
npm run dev
```

Site `http://localhost:5173` adresinde çalışacak.

## 📦 Build ve Deployment

### **Production Build**
```bash
bun run build
# veya
npm run build
```

### **GitHub Pages'e Deploy**
```bash
bun run deploy
# veya
npm run deploy
```

### **GitHub Pages Konfigürasyonu**
1. GitHub repository'nizde **Settings** → **Pages**
2. **Source**: "Deploy from a branch"
3. **Branch**: `gh-pages` seçin
4. **Save** butonuna tıklayın

Site `https://[kullanıcı-adınız].github.io/portfolyo/` adresinde yayınlanacak.

## 🗂️ Proje Yapısı

```
portfolyo_react/
├── public/                 # Static assets
│   └── logo.png           # Site logosu
├── src/
│   ├── assets/            # Images, icons
│   ├── lib/
│   │   └── firebase.ts    # Firebase konfigürasyonu
│   ├── pages/
│   │   └── Blog.tsx       # Blog sayfası
│   ├── App.tsx            # Ana portfolyo sayfası
│   ├── main.tsx           # React entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite type definitions
├── dist/                  # Build output
├── .env.example           # Environment variables template
├── .env                   # Environment variables (local)
├── package.json           # Dependencies ve scripts
├── vite.config.ts         # Vite konfigürasyonu
├── tailwind.config.js     # Tailwind CSS konfigürasyonu
├── tsconfig.json          # TypeScript konfigürasyonu
└── README.md              # Bu dosya
```

## 🎨 Özelleştirme

### **Kişisel Bilgileri Güncelleme**
`src/App.tsx` dosyasında aşağıdaki bölümleri düzenleyin:
- Hero section'daki isim ve açıklama
- Hakkımda bölümündeki bilgiler
- Yetenekler listesi
- Projeler dizisi
- İletişim bilgileri

### **Tema Renkleri**
Tailwind CSS konfigürasyonunu `tailwind.config.js` dosyasından özelleştirebilirsiniz.

### **Animasyonlar**
Framer Motion animasyonlarını `src/App.tsx` dosyasındaki `motion` bileşenlerinden düzenleyebilirsiniz.

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
bun run dev

# Production build
bun run build

# Build önizleme
bun run preview

# Linting
bun run lint

# GitHub Pages deploy
bun run deploy

# Pre-deploy build
bun run predeploy
```

## 🐛 Sorun Giderme

### **Firebase Bağlantı Sorunu**
- `.env` dosyasındaki Firebase konfigürasyonunu kontrol edin
- Firebase Console'da projenizin aktif olduğundan emin olun

### **Build Hatası**
- `node_modules` klasörünü silin ve tekrar yükleyin
- TypeScript hatalarını kontrol edin

### **Deployment Sorunu**
- `gh-pages` branch'inin oluşturulduğundan emin olun
- GitHub repository ayarlarında Pages konfigürasyonunu kontrol edin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **GitHub**: [@UgurOz1](https://github.com/UgurOz1)
- **Email**: uguro9319@gmail.com

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
