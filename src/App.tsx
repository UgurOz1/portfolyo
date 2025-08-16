

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Typing animation hook
const useTypingAnimation = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return displayText
}

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Animated Section Component
const AnimatedSection = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.section>
  )
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const typedText = useTypingAnimation('Uğur', 150)
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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50"
      >
        <nav className="mx-auto max-w-7xl px-6 sm:px-8 flex items-center justify-between h-20">
          <motion.a
            href="#"
            className="font-semibold tracking-tight text-white text-lg sm:text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-0.5 h-6 bg-sky-400 ml-1"
            />
          </motion.a>
          <div className="hidden md:flex items-center gap-3 text-base">
            <motion.button
              onClick={() => smoothScrollTo('about')}
              className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10 bg-white/10 text-white"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              Hakkımda
            </motion.button>
            <motion.button
              onClick={() => smoothScrollTo('skills')}
              className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              Yetenekler
            </motion.button>
            <motion.button
              onClick={() => smoothScrollTo('projects')}
              className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              Projeler
            </motion.button>
            <motion.button
              onClick={() => smoothScrollTo('contact')}
              className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              İletişim
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/blog" className="rounded-full px-4 py-2 text-slate-200 hover:text-white ring-1 ring-inset ring-white/10 hover:bg-white/10">Blog</Link>
            </motion.div>
          </div>
          <div className="md:hidden">
            <motion.button
              type="button"
              aria-label="Menüyü aç/kapat"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-white/10 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </motion.svg>
            </motion.button>
          </div>
        </nav>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/5 bg-slate-950/90 backdrop-blur overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-6 sm:px-8 py-3 flex flex-col gap-1">
                <motion.button
                  onClick={() => { smoothScrollTo('about'); setMobileOpen(false) }}
                  className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10 text-left"
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  Hakkımda
                </motion.button>
                <motion.button
                  onClick={() => { smoothScrollTo('skills'); setMobileOpen(false) }}
                  className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10 text-left"
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  Yetenekler
                </motion.button>
                <motion.button
                  onClick={() => { smoothScrollTo('projects'); setMobileOpen(false) }}
                  className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10 text-left"
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  Projeler
                </motion.button>
                <motion.button
                  onClick={() => { smoothScrollTo('contact'); setMobileOpen(false) }}
                  className="rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10 text-left"
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  İletişim
                </motion.button>
                <motion.div whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Link to="/blog" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10">Blog</Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* HERO */}
        <section className="relative py-20 sm:py-28 lg:py-32" aria-label="Giriş">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Merhaba, ben{' '}
                <motion.span
                  className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Uğur
                </motion.span>
              </motion.h1>
              <motion.p
                className="mt-5 max-w-2xl text-slate-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Web arayüzleri ve etkileşimli deneyimler tasarlayan bir geliştiriciyim. Modern, performanslı ve kullanıcı odaklı ürünler geliştiriyorum.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.button
                  onClick={() => smoothScrollTo('contact')}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  İletişime Geç
                </motion.button>
                <motion.button
                  onClick={() => smoothScrollTo('projects')}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-inset ring-white/15 backdrop-blur transition"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Projeleri Gör
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative mx-auto w-full max-w-md"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="mx-auto aspect-square w-72 rounded-full border border-white/10 bg-[conic-gradient(from_0deg,rgba(99,102,241,0.6),rgba(56,189,248,0.75),rgba(34,211,238,0.7),rgba(99,102,241,0.6))] ring-1 ring-inset ring-white/10 shadow-2xl"
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.1 }}
              />
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-sky-400/60 rounded-full"
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${10 + i * 15}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* HAKKIMDA */}
        <AnimatedSection id="about" className="scroll-mt-24 border-t border-white/5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">Hakkımda</h2>
            <p className="mt-2 text-sm text-slate-400">Kısa özet ve geçmiş</p>
          </motion.div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Sol: özet, öne çıkanlar, rozetler ve aksiyonlar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 10px 30px rgba(56, 189, 248, 0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Odak', value: 'UI/UX, Performans' },
                  { label: 'Araçlar', value: 'React, TS, Tailwind' },
                  { label: 'Yaklaşım', value: 'Basitlik, kalite' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-lg bg-slate-900/60 p-4 ring-1 ring-inset ring-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(56, 189, 248, 0.1)'
                    }}
                  >
                    <div className="text-sm text-slate-400">{item.label}</div>
                    <div className="text-white">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sağ: zaman çizelgesi */}
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(56, 189, 248, 0.1)'
              }}
            >
              <h3 className="text-sm text-slate-300">Deneyim Zaman Çizelgesi</h3>
              <ol className="relative mt-4 space-y-5 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-white/10">
                {[
                  {
                    title: 'Frontend Intern',
                    company: 'Rise Technology, Consulting & Academy',
                    url: 'https://www.rise-consulting.net/',
                    period: '2025 – Güncel',
                    description: 'React + TypeScript ile ürün/iç araç projeleri geliştirme, bileşen kütüphaneleri ve UI entegrasyonları.',
                    color: 'bg-sky-400'
                  },
                  {
                    title: 'Giresun Üniversitesi — Bilgisayar Mühendisliği (3. Sınıf)',
                    company: '',
                    url: '',
                    period: '—',
                    description: 'Algoritmalar, veri yapıları ve yazılım mühendisliği temelleri.',
                    color: 'bg-cyan-400'
                  }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="relative pl-8"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.span
                      className={`absolute left-0 top-2 h-2 w-2 rounded-full ${item.color}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      animate={{
                        scale: 1,
                        boxShadow: [
                          '0 0 0 0 rgba(56, 189, 248, 0.7)',
                          '0 0 0 10px rgba(56, 189, 248, 0)',
                        ]
                      }}
                      transition={{
                        scale: { duration: 0.4, delay: 0.8 + index * 0.2 },
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          delay: 1 + index * 0.5
                        }
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {item.title}
                        {item.company && (
                          <>
                            {' — '}
                            {item.url ? (
                              <motion.a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-sky-500/50 hover:text-sky-300"
                                whileHover={{ color: '#38bdf8' }}
                              >
                                {item.company}
                              </motion.a>
                            ) : (
                              item.company
                            )}
                          </>
                        )}
                      </span>
                      <span className="text-xs text-slate-400">{item.period}</span>
                    </div>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* YETENEKLER */}
        <AnimatedSection id="skills" className="scroll-mt-24 border-t border-white/5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">Yetenekler</h2>
            <p className="mt-2 text-sm text-slate-400">Teknik yetkinlikler</p>
          </motion.div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s, index) => (
              <motion.div
                key={s.label}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-inset ring-white/10 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 30px rgba(56, 189, 248, 0.2)'
                }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="inline-block h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="font-medium text-white">{s.label}</span>
                  </div>
                  <motion.span
                    className="text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    {s.level}%
                  </motion.span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_20px_#38bdf877]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* PROJELER - istenen kart stili */}
        <AnimatedSection id="projects" className="scroll-mt-24 border-t border-white/5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold tracking-tight">Projeler</h2>
            <p className="mt-2 text-sm text-slate-400">Seçili çalışmalarım. Kartların üzerine gelerek etkileşimi deneyimleyin.</p>
          </motion.div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, index) => (
              <motion.div
                key={p.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 ring-1 ring-inset ring-white/10 backdrop-blur"
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: '0 20px 40px rgba(56, 189, 248, 0.2)',
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="relative h-40 w-full bg-gradient-to-br from-sky-500/40 via-indigo-500/40 to-cyan-500/40 overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_2px,transparent_2px,transparent_8px)]"
                    animate={{
                      backgroundPosition: ['0px 0px', '20px 20px'],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  {/* Floating particles for projects */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/40 rounded-full"
                      style={{
                        top: `${20 + i * 20}%`,
                        left: `${10 + i * 30}%`,
                      }}
                      animate={{
                        y: [-5, 5, -5],
                        opacity: [0.2, 0.8, 0.2],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
                <div className="p-4">
                  <motion.h3
                    className="text-lg font-medium text-white"
                    whileHover={{ color: '#38bdf8' }}
                    transition={{ duration: 0.2 }}
                  >
                    {p.title}
                  </motion.h3>
                  <p className="mt-1 text-sm text-slate-400">{p.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {p.tags.map((t, tagIndex) => (
                      <motion.span
                        key={t}
                        className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + tagIndex * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.2)' }}
                      >
                        {t}
                      </motion.span>
                    ))}
                    {typeof p.stars === 'number' && (
                      <motion.span
                        className="ml-1 inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10"
                        whileHover={{ scale: 1.1 }}
                      >
                        ★ {p.stars}
                      </motion.span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {p.demo && (
                      <motion.a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-sky-500/20 px-3 py-1.5 text-xs text-sky-300 ring-1 ring-inset ring-sky-500/30"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: 'rgba(56, 189, 248, 0.3)',
                          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Demo
                      </motion.a>
                    )}
                    {p.code && (
                      <motion.a
                        href={p.code}
                        className="inline-flex items-center rounded-md bg-white/10 px-3 py-1.5 text-xs text-white ring-1 ring-inset ring-white/15"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Kod
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* İLETİŞİM - form tasarımı */}
        <AnimatedSection id="contact" className="scroll-mt-24 border-t border-white/5 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">İletişim</h2>
            <p className="mt-2 text-sm text-slate-400">Birlikte bir şeyler yapmak isterseniz formu doldurabilirsiniz.</p>
          </motion.div>
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/30 p-6 ring-1 ring-inset ring-white/10 backdrop-blur"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{
              boxShadow: '0 20px 40px rgba(56, 189, 248, 0.1)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <label className="text-sm text-slate-300">Ad Soyad</label>
              <motion.input
                type="text"
                placeholder="Adınız"
                className="mt-2 w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-all duration-300"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
                }}
              />
            </motion.div>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <label className="text-sm text-slate-300">E‑posta</label>
              <motion.input
                type="email"
                placeholder="ornek@mail.com"
                className="mt-2 w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-all duration-300"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
                }}
              />
            </motion.div>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <label className="text-sm text-slate-300">Mesaj</label>
              <motion.textarea
                rows={6}
                placeholder="Kısaca bahsedin..."
                className="mt-2 w-full resize-y rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60 transition-all duration-300"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
                }}
              />
            </motion.div>
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                type="submit"
                className="rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Gönder
              </motion.button>
            </motion.div>
          </motion.form>
        </AnimatedSection>
      </main>

      <motion.footer
        className="border-t border-white/5 py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="mx-auto max-w-7xl px-6 sm:px-8 text-sm text-slate-400"
          whileHover={{ color: '#38bdf8' }}
          transition={{ duration: 0.3 }}
        >
          © {new Date().getFullYear()} — ugur.dev
        </motion.div>
      </motion.footer>
    </div>
  )
}

export default App
