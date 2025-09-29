import { useState, useEffect } from 'react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, deleteDoc, updateDoc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteContent } from '../hooks/useSiteContent'
import { defaultContent } from '../hooks/useSiteContent'

type User = {
  uid: string
  email: string | null
  displayName: string | null
}

type Post = {
  id: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string
  createdAt: any
}



export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [posts, setPosts] = useState<Post[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        })

        // Admin kontrolü
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid))
          setIsAdmin(adminDoc.exists())
        } catch (error) {
          console.error('Admin kontrolü hatası:', error)
          setIsAdmin(false)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (isAdmin) {
      loadPosts()
      loadSiteContent()
    }
  }, [isAdmin])

  const loadPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
      setPosts(postsData)
    } catch (error) {
      console.error('Yazılar yüklenemedi:', error)
    }
  }

  const loadSiteContent = async () => {
    try {
      const contentDoc = await getDoc(doc(db, 'siteContent', 'main'))
      if (contentDoc.exists()) {
        console.log('Firebase\'den site içeriği yüklendi:', contentDoc.data())
        setSiteContent(contentDoc.data() as SiteContent)
      } else {
        console.log('Firebase\'de site içeriği yok, varsayılan içerik kullanılıyor:', defaultContent)
        setSiteContent(defaultContent)
      }
    } catch (error) {
      console.error('Site içeriği yüklenemedi:', error)
      console.log('Hata nedeniyle varsayılan içerik kullanılıyor:', defaultContent)
      setSiteContent(defaultContent)
    }
  }

  const saveSiteContent = async () => {
    if (!siteContent) return
    try {
      await setDoc(doc(db, 'siteContent', 'main'), siteContent)
      alert('Site içeriği güncellendi!')
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme hatası!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Admin Paneli</h1>
          <p className="mb-4">Giriş yapmanız gerekiyor</p>
          <Link to="/blog" className="text-sky-400 hover:text-sky-300">
            Blog sayfasından giriş yapın
          </Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Yetkisiz Erişim</h1>
          <p className="mb-4">Admin yetkileriniz bulunmuyor</p>
          <Link to="/" className="text-sky-400 hover:text-sky-300">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold text-white hover:text-sky-300 transition-colors">
                ← Ana Sayfa
              </Link>
              <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{user.email}</span>
              <button
                onClick={() => signOut(auth)}
                className="rounded-lg bg-red-500/20 px-3 py-1.5 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/30 hover:text-red-200 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'blog', label: 'Blog Yönetimi', icon: '📝' },
                { id: 'content', label: 'Site İçeriği', icon: '🎨' },
                { id: 'users', label: 'Kullanıcılar', icon: '👥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardTab posts={posts} />
                )}
                {activeTab === 'blog' && (
                  <BlogTab posts={posts} onRefresh={loadPosts} />
                )}
                {activeTab === 'content' && (
                  <ContentTab
                    siteContent={siteContent}
                    setSiteContent={setSiteContent}
                    onSave={saveSiteContent}
                  />
                )}
                {activeTab === 'users' && (
                  <UsersTab />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
// Dashboard Tab Component
function DashboardTab({ posts }: { posts: Post[] }) {
  const stats = {
    totalPosts: posts.length,
    recentPosts: posts.slice(0, 5),
    totalViews: posts.length * 42, // Mock data
    avgPostLength: posts.length > 0 ? Math.round(posts.reduce((acc, post) => acc + post.content.length, 0) / posts.length) : 0
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Yazı', value: stats.totalPosts, icon: '📝', color: 'sky' },
          { label: 'Toplam Görüntüleme', value: stats.totalViews, icon: '👁️', color: 'green' },
          { label: 'Ortalama Uzunluk', value: `${stats.avgPostLength} karakter`, icon: '📏', color: 'purple' },
          { label: 'Bu Ay', value: posts.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).length, icon: '📅', color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
        <h3 className="text-lg font-semibold mb-4">Son Yazılar</h3>
        <div className="space-y-3">
          {stats.recentPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60">
              <div>
                <h4 className="font-medium text-white">{post.title}</h4>
                <p className="text-sm text-slate-400">{new Date(post.date).toLocaleDateString('tr-TR')}</p>
              </div>
              <div className="flex gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-slate-800 rounded-full text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Blog Management Tab Component
function BlogTab({ posts, onRefresh }: { posts: Post[], onRefresh: () => void }) {
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const deletePost = async (postId: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return

    try {
      await deleteDoc(doc(db, 'posts', postId))
      alert('Yazı silindi!')
      onRefresh()
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme hatası!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blog Yönetimi</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-medium text-slate-950 hover:opacity-95 transition-opacity"
        >
          Yeni Yazı Oluştur
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingPost) && (
        <PostForm
          post={editingPost}
          onClose={() => {
            setShowCreateForm(false)
            setEditingPost(null)
          }}
          onSave={() => {
            setShowCreateForm(false)
            setEditingPost(null)
            onRefresh()
          }}
        />
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-slate-400 mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                  <span>•</span>
                  <span>{post.content.length} karakter</span>
                  <span>•</span>
                  <div className="flex gap-1">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingPost(post)}
                  className="rounded bg-sky-500/20 px-3 py-1.5 text-sky-300 hover:bg-sky-500/30 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="rounded bg-red-500/20 px-3 py-1.5 text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Post Form Component
function PostForm({
  post,
  onClose,
  onSave
}: {
  post: Post | null
  onClose: () => void
  onSave: () => void
}) {
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags.join(', ') || 'React, TypeScript')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        excerpt: content.trim().slice(0, 140) + '...',
        date: new Date().toISOString().slice(0, 10),
        updatedAt: new Date()
      }

      if (post) {
        // Update existing post
        await updateDoc(doc(db, 'posts', post.id), postData)
        alert('Yazı güncellendi!')
      } else {
        // Create new post
        await setDoc(doc(collection(db, 'posts')), {
          ...postData,
          createdAt: new Date()
        })
        alert('Yazı oluşturuldu!')
      }

      onSave()
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme hatası!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {post ? 'Yazıyı Düzenle' : 'Yeni Yazı Oluştur'}
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Başlık
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            placeholder="Yazı başlığı..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Etiketler
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            placeholder="React, TypeScript, Web Development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            İçerik
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full resize-y rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            placeholder="Yazı içeriği..."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-medium text-slate-950 hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : (post ? 'Güncelle' : 'Oluştur')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-slate-900/60 px-4 py-2 text-sm text-white ring-1 ring-inset ring-white/15 hover:bg-slate-900/80 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    </motion.div>
  )
}

// Content Management Tab Component
function ContentTab({
  siteContent,
  setSiteContent,
  onSave
}: {
  siteContent: SiteContent | null
  setSiteContent: (content: SiteContent) => void
  onSave: () => void
}) {
  const [activeSection, setActiveSection] = useState('hero')

  if (!siteContent) return <div>Yükleniyor...</div>

  const updateContent = (section: keyof SiteContent, data: any) => {
    setSiteContent({
      ...siteContent,
      [section]: data
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Site İçeriği</h2>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              setSiteContent(defaultContent)
              console.log('Varsayılan içerik yüklendi:', defaultContent)

              // Otomatik olarak Firebase'e kaydet
              try {
                await setDoc(doc(db, 'siteContent', 'main'), defaultContent)
                alert('Varsayılan içerik yüklendi ve Firebase\'e kaydedildi!')
              } catch (error) {
                console.error('Firebase\'e kaydetme hatası:', error)
                alert('İçerik yüklendi ama Firebase\'e kaydedilemedi!')
              }
            }}
            className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
          >
            Varsayılan İçeriği Yükle & Kaydet
          </button>
          <button
            onClick={onSave}
            className="rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-medium text-slate-950 hover:opacity-95 transition-opacity"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'hero', label: 'Ana Bölüm', icon: '🏠' },
          { id: 'about', label: 'Hakkımda', icon: '👤' },
          { id: 'skills', label: 'Yetenekler', icon: '🛠️' },
          { id: 'projects', label: 'Projeler', icon: '💼' },
          { id: 'contact', label: 'İletişim', icon: '📧' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeSection === section.id
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Forms */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
        {activeSection === 'hero' && (
          <HeroForm
            data={siteContent.hero}
            onChange={(data) => updateContent('hero', data)}
          />
        )}
        {activeSection === 'about' && (
          <AboutForm
            data={siteContent.about}
            onChange={(data) => updateContent('about', data)}
          />
        )}
        {activeSection === 'skills' && (
          <SkillsForm
            data={siteContent.skills}
            onChange={(data) => updateContent('skills', data)}
          />
        )}
        {activeSection === 'projects' && (
          <ProjectsForm
            data={siteContent.projects}
            onChange={(data) => updateContent('projects', data)}
          />
        )}
        {activeSection === 'contact' && (
          <ContactForm
            data={siteContent.contact}
            onChange={(data) => updateContent('contact', data)}
          />
        )}
      </div>
    </div>
  )
}

// Hero Form Component
function HeroForm({ data, onChange }: { data: SiteContent['hero'], onChange: (data: SiteContent['hero']) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Ana Bölüm Ayarları</h3>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">İsim</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Başlık</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Açıklama</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className="w-full resize-y rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>
    </div>
  )
}

// Skills Form Component
function SkillsForm({ data, onChange }: { data: SiteContent['skills'], onChange: (data: SiteContent['skills']) => void }) {
  const addSkill = () => {
    onChange([...data, { label: 'Yeni Yetenek', level: 50 }])
  }

  const updateSkill = (index: number, skill: { label: string, level: number }) => {
    const newSkills = [...data]
    newSkills[index] = skill
    onChange(newSkills)
  }

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Yetenekler</h3>
        <button
          onClick={addSkill}
          className="rounded-lg bg-sky-500/20 px-3 py-1.5 text-sky-300 hover:bg-sky-500/30 transition-colors"
        >
          Yetenek Ekle
        </button>
      </div>

      <div className="space-y-3">
        {data.map((skill, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60">
            <input
              type="text"
              value={skill.label}
              onChange={(e) => updateSkill(index, { ...skill, label: e.target.value })}
              className="flex-1 rounded bg-slate-800 px-3 py-2 text-white text-sm"
              placeholder="Yetenek adı"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => updateSkill(index, { ...skill, level: parseInt(e.target.value) })}
              className="w-24"
            />
            <span className="text-sm text-slate-300 w-12">{skill.level}%</span>
            <button
              onClick={() => removeSkill(index)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// About Form Component
function AboutForm({ data, onChange }: { data: SiteContent['about'], onChange: (data: SiteContent['about']) => void }) {
  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, {
        title: 'Yeni Pozisyon',
        company: 'Şirket Adı',
        period: '2025',
        description: 'Açıklama'
      }]
    })
  }

  const updateExperience = (index: number, exp: SiteContent['about']['experience'][0]) => {
    const newExp = [...data.experience]
    newExp[index] = exp
    onChange({ ...data, experience: newExp })
  }

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Hakkımda Bölümü</h3>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Özet</label>
        <textarea
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          rows={4}
          className="w-full resize-y rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Deneyimler</h4>
          <button
            onClick={addExperience}
            className="rounded-lg bg-sky-500/20 px-3 py-1.5 text-sky-300 hover:bg-sky-500/30 transition-colors"
          >
            Deneyim Ekle
          </button>
        </div>

        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium">Deneyim {index + 1}</h5>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  🗑️
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, { ...exp, title: e.target.value })}
                  placeholder="Pozisyon"
                  className="rounded bg-slate-800 px-3 py-2 text-white text-sm"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, { ...exp, company: e.target.value })}
                  placeholder="Şirket"
                  className="rounded bg-slate-800 px-3 py-2 text-white text-sm"
                />
              </div>

              <input
                type="text"
                value={exp.period}
                onChange={(e) => updateExperience(index, { ...exp, period: e.target.value })}
                placeholder="Dönem (örn: 2024 - Güncel)"
                className="w-full rounded bg-slate-800 px-3 py-2 text-white text-sm"
              />

              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(index, { ...exp, description: e.target.value })}
                placeholder="Açıklama"
                rows={2}
                className="w-full resize-y rounded bg-slate-800 px-3 py-2 text-white text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Projects Form Component
function ProjectsForm({ data, onChange }: { data: SiteContent['projects'], onChange: (data: SiteContent['projects']) => void }) {
  const addProject = () => {
    onChange([...data, {
      title: 'Yeni Proje',
      description: 'Proje açıklaması',
      tags: ['React'],
      stars: 0,
      demo: '',
      code: ''
    }])
  }

  const updateProject = (index: number, project: SiteContent['projects'][0]) => {
    const newProjects = [...data]
    newProjects[index] = project
    onChange(newProjects)
  }

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projeler</h3>
        <button
          onClick={addProject}
          className="rounded-lg bg-sky-500/20 px-3 py-1.5 text-sky-300 hover:bg-sky-500/30 transition-colors"
        >
          Proje Ekle
        </button>
      </div>

      <div className="space-y-4">
        {data.map((project, index) => (
          <div key={index} className="p-4 rounded-lg bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Proje {index + 1}</h5>
              <button
                onClick={() => removeProject(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                🗑️
              </button>
            </div>

            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProject(index, { ...project, title: e.target.value })}
              placeholder="Proje başlığı"
              className="w-full rounded bg-slate-800 px-3 py-2 text-white text-sm"
            />

            <textarea
              value={project.description}
              onChange={(e) => updateProject(index, { ...project, description: e.target.value })}
              placeholder="Proje açıklaması"
              rows={2}
              className="w-full resize-y rounded bg-slate-800 px-3 py-2 text-white text-sm"
            />

            <input
              type="text"
              value={project.tags.join(', ')}
              onChange={(e) => updateProject(index, {
                ...project,
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              placeholder="Teknolojiler (virgülle ayırın)"
              className="w-full rounded bg-slate-800 px-3 py-2 text-white text-sm"
            />

            <input
              type="number"
              value={project.stars || 0}
              onChange={(e) => updateProject(index, { ...project, stars: parseInt(e.target.value) || 0 })}
              placeholder="Yıldız sayısı"
              className="w-full rounded bg-slate-800 px-3 py-2 text-white text-sm"
              min="0"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="url"
                value={project.demo || ''}
                onChange={(e) => updateProject(index, { ...project, demo: e.target.value })}
                placeholder="Demo URL (opsiyonel)"
                className="rounded bg-slate-800 px-3 py-2 text-white text-sm"
              />
              <input
                type="url"
                value={project.code || ''}
                onChange={(e) => updateProject(index, { ...project, code: e.target.value })}
                placeholder="Kod URL (opsiyonel)"
                className="rounded bg-slate-800 px-3 py-2 text-white text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Contact Form Component
function ContactForm({ data, onChange }: { data: SiteContent['contact'], onChange: (data: SiteContent['contact']) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">E-posta</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
        <input
          type="url"
          value={data.github}
          onChange={(e) => onChange({ ...data, github: e.target.value })}
          className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL (opsiyonel)</label>
        <input
          type="url"
          value={data.linkedin || ''}
          onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
          className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        />
      </div>
    </div>
  )
}

// Users Management Tab Component
function UsersTab() {
  const [adminEmail, setAdminEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const addAdmin = async () => {
    if (!adminEmail.trim()) return

    setLoading(true)
    try {
      // Bu basit bir örnek - gerçek uygulamada kullanıcı UID'si gerekir
      alert('Admin ekleme özelliği geliştirme aşamasında. Firebase Authentication ile kullanıcı UID\'si gerekiyor.')
    } catch (error) {
      console.error('Admin ekleme hatası:', error)
      alert('Admin ekleme hatası!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
        <h3 className="text-lg font-semibold mb-4">Yeni Admin Ekle</h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="Admin e-posta adresi"
            className="flex-1 rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
          />
          <button
            onClick={addAdmin}
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-medium text-slate-950 hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Ekleniyor...' : 'Admin Ekle'}
          </button>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Not: Kullanıcının önce Google ile giriş yapması ve UID'sinin bilinmesi gerekir.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
        <h3 className="text-lg font-semibold mb-4">Mevcut Adminler</h3>
        <p className="text-slate-400">Admin listesi Firebase'den yüklenecek...</p>
      </div>
    </div>
  )
}