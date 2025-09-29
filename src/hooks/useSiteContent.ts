import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

type SiteContent = {
  hero: {
    name: string
    title: string
    description: string
  }
  about: {
    summary: string
    experience: Array<{
      title: string
      company: string
      period: string
      description: string
    }>
  }
  skills: Array<{
    label: string
    level: number
  }>
  projects: Array<{
    title: string
    description: string
    tags: string[]
    stars?: number
    demo?: string
    code?: string
  }>
  contact: {
    email: string
    github: string
    linkedin?: string
  }
}

const defaultContent: SiteContent = {
  hero: {
    name: 'Uğur',
    title: 'Frontend Developer',
    description: 'Web arayüzleri ve etkileşimli deneyimler tasarlayan bir geliştiriciyim. Modern, performanslı ve kullanıcı odaklı ürünler geliştiriyorum.'
  },
  about: {
    summary: 'Frontend odaklı bir geliştiriciyim. Tasarım sistemleri kurar, performans ve erişilebilirliği önceleyerek modern arayüzler geliştiririm. Temiz kod, yeniden kullanılabilir bileşenler ve yalın mimari benim için temel prensiplerdir. Şu anda Rise Technology, Consulting & Academy\'de staj yapıyorum ve React + TypeScript ile projeler geliştiriyorum. Giresun Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.',
    experience: [
      {
        title: 'Frontend Intern',
        company: 'Rise Technology, Consulting & Academy',
        period: '2025 – Güncel',
        description: 'React + TypeScript ile ürün/iç araç projeleri geliştirme, bileşen kütüphaneleri ve UI entegrasyonları.'
      },
      {
        title: 'Giresun Üniversitesi — Bilgisayar Mühendisliği (3. Sınıf)',
        company: '',
        period: '—',
        description: 'Algoritmalar, veri yapıları ve yazılım mühendisliği temelleri.'
      }
    ]
  },
  skills: [
    { label: 'React', level: 70 },
    { label: 'TypeScript', level: 70 },
    { label: 'Tailwind CSS', level: 70 },
    { label: 'Java', level: 50 },
    { label: 'Python', level: 70 },
    { label: 'Git', level: 80 }
  ],
  projects: [
    {
      title: 'restoran-App',
      description: 'Açıklama eklenmemiş.',
      tags: ['TypeScript'],
      stars: 0,
      code: 'https://github.com/UgurOz1/restoran-App'
    },
    {
      title: 'To-Do-List',
      description: 'Açıklama eklenmemiş.',
      tags: ['TypeScript'],
      stars: 0,
      code: 'https://github.com/UgurOz1/To-Do-List'
    },
    {
      title: 'TechBlog',
      description: 'Açıklama eklenmemiş.',
      tags: ['Python'],
      stars: 0,
      code: 'https://github.com/UgurOz1/TechBlog'
    },
    {
      title: 'mucize_komur_evi',
      description: 'Açıklama eklenmemiş.',
      tags: ['CSS'],
      stars: 0,
      demo: 'https://uguroz1.github.io/mucize_komur_evi/',
      code: 'https://github.com/UgurOz1/mucize_komur_evi'
    },
    {
      title: 'TicTacToe',
      description: 'A simple TicTacToe game developed with Java',
      tags: ['Java'],
      stars: 0,
      code: 'https://github.com/UgurOz1/TicTacToe'
    },
    {
      title: 'StudentDatabaseApplication',
      description: 'It is a simple project that was developed with Java',
      tags: ['Java'],
      stars: 0,
      code: 'https://github.com/UgurOz1/StudentDatabaseApplication'
    }
  ],
  contact: {
    email: 'uguro9319@gmail.com',
    github: 'https://github.com/UgurOz1'
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentDoc = await getDoc(doc(db, 'siteContent', 'main'))
        if (contentDoc.exists()) {
          console.log('Firebase\'den site içeriği yüklendi')
          setContent(contentDoc.data() as SiteContent)
        } else {
          console.log('Firebase\'de site içeriği yok, varsayılan içerik kullanılıyor')
          // Varsayılan içerik zaten state'te var
        }
      } catch (error) {
        console.error('Site içeriği yüklenemedi:', error)
        // Varsayılan içerik kullanılacak
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])
  
  return { content, loading, setContent }
}

export { defaultContent }
export type { SiteContent }