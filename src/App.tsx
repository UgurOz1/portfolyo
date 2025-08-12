

import { useState } from 'react'
import { Link } from 'react-router-dom'

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const skills: Array<{ label: string; level: number }> = [
    { label: 'React', level: 70 },
    { label: 'TypeScript', level: 70 },
    { label: 'Tailwind CSS', level: 70 },
    { label: 'Java', level: 50 },
    { label: 'Python', level: 70 },
    { label: 'Git', level: 80 },
  ]

  const projects: Array<{
    title: string
    description: string
    tags: string[]
    stars?: number
    demo?: string
    code?: string
  }> = [
    {
      title: 'restoran-App',
      description: 'Açıklama eklenmemiş.',
      tags: ['TypeScript'],
      stars: 0,
      code: 'https://github.com/UgurOz1/restoran-App',
    },
    {
      title: 'To-Do-List',
      description: 'Açıklama eklenmemiş.',
      tags: ['TypeScript'],
      stars: 0,
      code: 'https://github.com/UgurOz1/To-Do-List',
    },
    {
      title: 'TechBlog',
      description: 'Açıklama eklenmemiş.',
      tags: ['Python'],
      stars: 0,
      code: 'https://github.com/UgurOz1/TechBlog',
    },
    {
      title: 'mucize_komur_evi',
      description: 'Açıklama eklenmemiş.',
      tags: ['CSS'],
      stars: 0,
      demo: 'https://uguroz1.github.io/mucize_komur_evi/',
      code: 'https://github.com/UgurOz1/mucize_komur_evi',
    },
    {
      title: 'TicTacToe',
      description: 'A simple TicTacToe game developed with Java',
      tags: ['Java'],
      stars: 0,
      code: 'https://github.com/UgurOz1/TicTacToe',
    },
    {
      title: 'StudentDatabaseApplication',
      description: 'It is a simple project that was developed with Java',
      tags: ['Java'],
      stars: 0,
      code: 'https://github.com/UgurOz1/StudentDatabaseApplication',
    },
  ]






  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-400/20">
      {/* Arkaplan dokuları */}
      <div className="pointer-events-none fixed inset-0 -z-20 [mask-image:radial-gradient(ellipse_65%_65%_at_50%_-10%,black,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(75%_55%_at_80%_-10%,rgba(56,189,248,0.18),transparent),radial-gradient(60%_60%_at_0%_10%,rgba(99,102,241,0.18),transparent)]" />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
        <nav className="mx-auto max-w-7xl px-6 sm:px-8 flex items-center justify-between h-20">
          <a href="#" className="font-semibold tracking-tight text-white text-lg sm:text-xl">Uğur</a>
          <div className="hidden md:flex items-center gap-3 text-base">
            <a href="#about" className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10 bg-white/10 text-white">Hakkımda</a>
            <a href="#skills" className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">Yetenekler</a>
            <a href="#projects" className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">Projeler</a>
            <a href="#contact" className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">İletişim</a>
            <Link to="/blog" className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">Blog</Link>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Menüyü aç/kapat"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-white/10 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 py-3 flex flex-col gap-1">
              <a href="#about" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10">Hakkımda</a>
              <a href="#skills" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10">Yetenekler</a>
              <a href="#projects" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10">Projeler</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10">İletişim</a>
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10">Blog</Link>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* HERO */}
        <section className="relative py-20 sm:py-28 lg:py-32" aria-label="Giriş">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                Merhaba, ben <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Uğur</span>
              </h1>
              <p className="mt-5 max-w-2xl text-slate-300">Web arayüzleri ve etkileşimli deneyimler tasarlayan bir geliştiriciyim. Modern, performanslı ve kullanıcı odaklı ürünler geliştiriyorum.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm hover:opacity-95">İletişime Geç</a>
                <a href="#projects" className="inline-flex items-center justify-center rounded-full bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-slate-900/80">Projeleri Gör</a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="mx-auto aspect-square w-72 rounded-full border border-white/10 bg-[conic-gradient(from_0deg,rgba(99,102,241,0.6),rgba(56,189,248,0.75),rgba(34,211,238,0.7),rgba(99,102,241,0.6))] ring-1 ring-inset ring-white/10 shadow-2xl" />
            </div>
          </div>
        </section>

        {/* HAKKIMDA */}
        <section id="about" className="scroll-mt-24 border-t border-white/5 py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Hakkımda</h2>
            <p className="mt-2 text-sm text-slate-400">Kısa özet ve geçmiş</p>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Sol: özet, öne çıkanlar, rozetler ve aksiyonlar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                <p className="leading-relaxed text-slate-300">
                  Frontend odaklı bir geliştiriciyim. Tasarım sistemleri kurar, performans ve erişilebilirliği önceleyerek
                  modern arayüzler geliştiririm. Temiz kod, yeniden kullanılabilir bileşenler ve yalın mimari benim için
                  temel prensiplerdir. Şu anda{' '}
                  <a href="https://www.rise-consulting.net/" target="_blank" rel="noreferrer" className="underline decoration-sky-500/50 hover:text-sky-300">Rise Technology, Consulting & Academy</a>
                  'de staj yapıyorum ve React + TypeScript ile projeler geliştiriyorum. Giresun Üniversitesi Bilgisayar
                  Mühendisliği 3. sınıf öğrencisiyim.
                </p>
                <ul className="mt-5 space-y-2 text-slate-300">
                  <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-400" /> Tasarım sistemi oluşturma ve komponent mimarisi</li>
                  <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-400" /> Performans optimizasyonu (bundle, lazy, memoization)</li>
                  <li className="flex items-start gap-3"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-400" /> Erişilebilirlik ve test odaklı geliştirme</li>
                </ul>
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-wide text-slate-400">Şu an</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((chip) => (
                      <span key={chip} className="rounded-full bg-slate-900/60 px-3 py-1 text-xs text-slate-300 ring-1 ring-inset ring-white/10">{chip}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="uguro9319@gmail.com" className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-2 text-sm text-sky-300 ring-1 ring-inset ring-sky-500/30 hover:bg-sky-500/20">E‑posta</a>
                  <a href="https://github.com/UgurOz1" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-100">CV / GitHub</a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-900/60 p-4 ring-1 ring-inset ring-white/10">
                  <div className="text-sm text-slate-400">Odak</div>
                  <div className="text-white">UI/UX, Performans</div>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-4 ring-1 ring-inset ring-white/10">
                  <div className="text-sm text-slate-400">Araçlar</div>
                  <div className="text-white">React, TS, Tailwind</div>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-4 ring-1 ring-inset ring-white/10">
                  <div className="text-sm text-slate-400">Yaklaşım</div>
                  <div className="text-white">Basitlik, kalite</div>
                </div>
              </div>
            </div>

            {/* Sağ: zaman çizelgesi */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
              <h3 className="text-sm text-slate-300">Deneyim Zaman Çizelgesi</h3>
              <ol className="relative mt-4 space-y-5 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-white/10">
                <li className="relative pl-8">
                  <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-sky-400" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Frontend Intern — <a href="https://www.rise-consulting.net/" target="_blank" rel="noreferrer" className="underline decoration-sky-500/50 hover:text-sky-300">Rise Technology, Consulting & Academy</a></span>
                    <span className="text-xs text-slate-400">2025 – Güncel</span>
                  </div>
                  <p className="text-sm text-slate-400">React + TypeScript ile ürün/iç araç projeleri geliştirme, bileşen kütüphaneleri ve UI entegrasyonları.</p>
                </li>
                
                <li className="relative pl-8">
                  <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-cyan-400" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Giresun Üniversitesi — Bilgisayar Mühendisliği (3. Sınıf)</span>
                    <span className="text-xs text-slate-400">—</span>
                  </div>
                  <p className="text-sm text-slate-400">Algoritmalar, veri yapıları ve yazılım mühendisliği temelleri.</p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* YETENEKLER */}
        <section id="skills" className="scroll-mt-24 border-t border-white/5 py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Yetenekler</h2>
            <p className="mt-2 text-sm text-slate-400">Teknik yetkinlikler</p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s) => (
              <div key={s.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-inset ring-white/10">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500" />
                    <span className="font-medium text-white">{s.label}</span>
                  </div>
                  <span className="text-sm text-slate-400">{s.level}%</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_20px_#38bdf877]"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJELER - istenen kart stili */}
        <section id="projects" className="scroll-mt-24 border-t border-white/5 py-20">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Projeler</h2>
            <p className="mt-2 text-sm text-slate-400">Seçili çalışmalarım. Kartların üzerine gelerek etkileşimi deneyimleyin.</p>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 ring-1 ring-inset ring-white/10 backdrop-blur"
              >
                <div className="relative h-40 w-full bg-gradient-to-br from-sky-500/40 via-indigo-500/40 to-cyan-500/40">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_2px,transparent_2px,transparent_8px)]" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{p.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10">{t}</span>
                    ))}
                    {typeof p.stars === 'number' && (
                      <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
                        ★ {p.stars}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md bg-sky-500/20 px-3 py-1.5 text-xs text-sky-300 ring-1 ring-inset ring-sky-500/30 hover:bg-sky-500/30">Demo</a>
                    )}
                    {p.code && (
                      <a href={p.code} className="inline-flex items-center rounded-md bg-white/10 px-3 py-1.5 text-xs text-white ring-1 ring-inset ring-white/15 hover:bg-white/20">Kod</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        

        {/* İLETİŞİM - form tasarımı */}
        <section id="contact" className="scroll-mt-24 border-t border-white/5 py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">İletişim</h2>
            <p className="mt-2 text-sm text-slate-400">Birlikte bir şeyler yapmak isterseniz formu doldurabilirsiniz.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-6 ring-1 ring-inset ring-white/10 backdrop-blur">
            <div>
              <label className="text-sm text-slate-300">Ad Soyad</label>
              <input type="text" placeholder="Adınız" className="mt-2 w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60" />
            </div>
            <div className="mt-4">
              <label className="text-sm text-slate-300">E‑posta</label>
              <input type="email" placeholder="ornek@mail.com" className="mt-2 w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60" />
            </div>
            <div className="mt-4">
              <label className="text-sm text-slate-300">Mesaj</label>
              <textarea rows={6} placeholder="Kısaca bahsedin..." className="mt-2 w-full resize-y rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60" />
            </div>
            <div className="mt-6">
              <button type="submit" className="rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm hover:opacity-95">Gönder</button>
            </div>
          </form>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-sm text-slate-400">
          © {new Date().getFullYear()} — ugur.dev
        </div>
      </footer>
      </div>
  )
}

export default App
