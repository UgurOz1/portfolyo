import { useEffect, useMemo, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'

const blogPosts = [
  {
    id: 'react-performans-ipuclari',
    title: 'React + TypeScript ile performans ipuçları',
    date: '2025-05-01',
    tags: ['React', 'TypeScript', 'Performans'],
    excerpt:
      'Memoization, kod bölme ve uygun durum yönetimi ile arayüzlerinizi nasıl hızlandırabileceğinizi anlatıyorum.',
    content:
      'Bileşenlerin yeniden render edilme sayısını azaltmak için useMemo/useCallback ve React.memo kullanımı, dinamik import ile kod bölme, liste renderlarında key ve sanal listeleme gibi yöntemleri uygulamak büyük fark yaratır. Ayrıca server state ile client state ayrımını netleştirmek uygulamayı sadeleştirir.',
  },
  {
    id: 'tailwind-ile-tasarim-sistemi',
    title: 'Tailwind CSS ile tasarım sistemi kurmak',
    date: '2025-04-10',
    tags: ['Tailwind', 'Design System'],
    excerpt:
      'Token tabanlı renkler, tipografi ölçekleri ve yardımcı sınıflarla tutarlı bir sistem kurma yaklaşımı.',
    content:
      'Renkler, aralıklar ve tipografi gibi temel tasarım tokenlarını tailwind.config içinde genişletmek; bileşenlere anlamlı yardımcı sınıflar atamak ve varyantları (hover, focus, aria) standartlaştırmak hızlı ve tutarlı arayüz üretir.',
  },
  {
    id: 'vite-ile-hizli-gelistirme',
    title: 'Vite ile hızlı geliştirme deneyimi',
    date: '2025-03-15',
    tags: ['Vite', 'Build Tools', 'Developer Experience'],
    excerpt:
      'ES modules tabanlı bundler ile geliştirme sürecini nasıl hızlandırabileceğinizi gösteriyorum.',
    content:
      'Vite, geliştirme sunucusunda ES modules kullanarak sadece değişen dosyaları yeniden yükler. Bu sayede büyük projelerde bile hot reload süresi milisaniyeler seviyesinde kalır. Production build için Rollup kullanarak optimize edilmiş bundle üretir.',
  },
]

export default function Blog() {
  const [blogSearch, setBlogSearch] = useState('')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [posts, setPosts] = useState<typeof blogPosts>([])
  const [user, setUser] = useState<null | { uid: string; email: string | null }>(null)
  const [editMode, setEditMode] = useState(false)
  const [editPost, setEditPost] = useState<typeof blogPosts[0] | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email })
        // Blog yazılarını yükle
        try {
          const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
          const snap = await getDocs(q)
          const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as typeof blogPosts
          if (result.length) setPosts(result)
          else setPosts(blogPosts)
        } catch (error) {
          console.error('Blog yazıları yüklenemedi:', error)
          setPosts(blogPosts)
        }
      } else {
        setUser(null)
        setPosts(blogPosts)
      }
    })
    return unsubscribe
  }, [])

  const filteredBlogPosts = useMemo(() => {
    const qStr = blogSearch.trim().toLowerCase()
    const source = posts.length ? posts : blogPosts
    if (!qStr) return source
    return source.filter((p) => [p.title, p.excerpt, ...(p.tags || [])].some((t) => t.toLowerCase().includes(qStr)))
  }, [blogSearch, posts])

  const isAdmin = async (): Promise<boolean> => {
    if (!user) return false
    try {
      console.log('Checking admin for UID:', user.uid)
      const adminDoc = await getDoc(doc(db, 'admins', user.uid))
      console.log('Admin doc exists:', adminDoc.exists())
      return adminDoc.exists()
    } catch (error) {
      console.error('Admin check error:', error)
      return false
    }
  }

  const createPost = async (payload: { title: string; tags: string[]; content: string }) => {
    if (!(await isAdmin())) return alert('Sadece admin yazı oluşturabilir')
    const newDoc = {
      title: payload.title,
      tags: payload.tags,
      excerpt: payload.content.slice(0, 140) + '…',
      content: payload.content,
      createdAt: serverTimestamp(),
      date: new Date().toISOString().slice(0, 10),
    }
    await addDoc(collection(db, 'posts'), newDoc as any)
    alert('Yazı yayınlandı')
    // Yazı listesini yenile
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
    const snap = await getDocs(q)
    const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as typeof blogPosts
    if (result.length) setPosts(result)
  }

  const updatePost = async (postId: string, payload: { title: string; tags: string[]; content: string }) => {
    if (!(await isAdmin())) return alert('Sadece admin yazı güncelleyebilir')
    try {
      const { updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'posts', postId), {
        title: payload.title,
        tags: payload.tags,
        excerpt: payload.content.slice(0, 140) + '…',
        content: payload.content,
        updatedAt: serverTimestamp(),
      })
      alert('Yazı güncellendi')
      // Yazı listesini yenile
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
      const snap = await getDocs(q)
      const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as typeof blogPosts
      if (result.length) setPosts(result)
    } catch (error) {
      alert('Güncelleme hatası: ' + error)
    }
  }

  const deletePost = async (postId: string) => {
    if (!(await isAdmin())) return alert('Sadece admin yazı silebilir')
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return
    try {
      const { deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'posts', postId))
      alert('Yazı silindi')
      // Yazı listesini yenile
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
      const snap = await getDocs(q)
      const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as typeof blogPosts
      if (result.length) setPosts(result)
    } catch (error) {
      alert('Silme hatası: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white hover:text-sky-300 transition-colors">
              ← Ana Sayfa
            </a>
            <h1 className="text-2xl font-bold text-white">Blog</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <span className="text-sm text-slate-300">{user.email}</span>
              ) : (
                <button
                  onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-inset ring-white/15 hover:bg-white/20"
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Blog Bölümü */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Blog</h2>
            <p className="mt-2 text-sm text-slate-400">Notlar, ipuçları ve öğrendiklerim.</p>
          </div>
          
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sol: Liste ve arama */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <input
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  placeholder="Ara: React, Tailwind..."
                  className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </div>
              
              <div className="mt-4 grid gap-4">
                {filteredBlogPosts.map((post) => (
                  <div key={post.id} className="group relative">
                    <button
                      onClick={() => setSelectedPostId(post.id)}
                      className="w-full text-left rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-inset ring-white/10 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-white">{post.title}</h3>
                        <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{post.excerpt}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((t) => (
                            <span key={t} className="rounded-md bg-slate-900/60 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10">{t}</span>
                          ))}
                        </div>
                        
                        {/* Admin işlem butonları - Kartın içinde sağ alt */}
                        {user && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPostId(post.id)
                                setEditMode(true)
                                setEditPost(post)
                              }}
                              className="rounded-md bg-sky-500/20 px-2 py-1 text-xs text-sky-300 ring-1 ring-inset ring-sky-500/30 hover:bg-sky-500/30 hover:text-sky-200 transition-colors"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deletePost(post.id)
                              }}
                              className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/30 hover:text-red-200 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: İçerik */}
            <div className="lg:w-[45%]">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                {(() => {
                  const active = selectedPostId
                    ? (posts.length ? posts : blogPosts).find((p) => p.id === selectedPostId)
                    : (posts.length ? posts : blogPosts)[0]
                  if (!active) return null
                  return (
                    <article>
                      <h3 className="text-xl font-semibold text-white">{active.title}</h3>
                      <div className="mt-1 text-xs text-slate-400">{new Date(active.date).toLocaleDateString('tr-TR')}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {active.tags.map((t) => (
                          <span key={t} className="rounded-md bg-slate-900/60 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-inset ring-white/10">{t}</span>
                        ))}
                      </div>
                      <p className="mt-4 leading-relaxed text-slate-300">{active.content}</p>
                    </article>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Admin yazı oluşturma */}
          <AdminComposer 
            canWrite={isAdmin} 
            onCreate={createPost} 
            onUpdate={updatePost}
            onLogin={() => signInWithPopup(auth, new GoogleAuthProvider())} 
            onLogout={() => signOut(auth)} 
            userEmail={user?.email ?? null}
            editMode={editMode}
            setEditMode={setEditMode}
            editPost={editPost}
            setEditPost={setEditPost}
          />
        </section>
      </main>
    </div>
  )
}

type AdminComposerProps = {
  canWrite: () => Promise<boolean>
  onCreate: (p: { title: string; tags: string[]; content: string }) => Promise<void>
  onUpdate: (postId: string, payload: { title: string; tags: string[]; content: string }) => Promise<void>
  onLogin: () => void
  onLogout: () => void
  userEmail: string | null
  editMode: boolean
  setEditMode: (mode: boolean) => void
  editPost: any | null
  setEditPost: (post: any | null) => void
}

function AdminComposer({ canWrite, onCreate, onUpdate, onLogin, onLogout, userEmail, editMode, setEditMode, editPost, setEditPost }: AdminComposerProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('React,TypeScript')
  const [content, setContent] = useState('')
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    ;(async () => {
      setAllowed(await canWrite())
    })()
  }, [canWrite, userEmail])

  // Edit mode'da form alanlarını doldur
  useEffect(() => {
    if (editPost && editMode) {
      setTitle(editPost.title)
      setTags(editPost.tags.join(','))
      setContent(editPost.content)
      setOpen(true)
    }
  }, [editPost, editMode])

  const handleSubmit = async () => {
    if (editMode && editPost) {
      await onUpdate(editPost.id, { title, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), content })
      setEditMode(false)
      setEditPost(null)
    } else {
      await onCreate({ title, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), content })
    }
    // Form'u temizle
    setTitle('')
    setTags('React,TypeScript')
    setContent('')
    setOpen(false)
  }

  const handleCancel = () => {
    setEditMode(false)
    setEditPost(null)
    setTitle('')
    setTags('React,TypeScript')
    setContent('')
    setOpen(false)
  }

  if (allowed === null) return null
  if (!allowed)
    return (
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        Admin olarak giriş yaparsanız blog yazısı oluşturabilirsiniz.
        <div className="mt-3 flex gap-2">
          {userEmail ? (
            <button onClick={onLogout} className="rounded-md bg-white/10 px-3 py-1.5 text-white ring-1 ring-inset ring-white/15 hover:bg-white/20">Çıkış Yap ({userEmail})</button>
          ) : (
            <button onClick={onLogin} className="rounded-md bg-white/10 px-3 py-1.5 text-white ring-1 ring-inset ring-white/15 hover:bg-white/20">Google ile Giriş Yap</button>
          )}
        </div>
      </div>
    )

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2 text-sm font-medium text-slate-950 hover:opacity-95"
      >
        {open ? (editMode ? 'Düzenlemeyi Gizle' : 'Yeni Yazıyı Gizle') : 'Yeni Yazı Oluştur'}
      </button>

      {open && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-inset ring-white/10">
          <div className="grid gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık"
              className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Etiketler: React,TypeScript"
              className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="İçerik"
              className="w-full resize-y rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <div>
              <button
                onClick={handleSubmit}
                className="rounded-md bg-white text-slate-900 px-4 py-2 text-sm hover:bg-slate-100"
              >
                {editMode ? 'Güncelle' : 'Yayınla'}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-md bg-slate-900/60 px-4 py-2 text-sm text-white ring-1 ring-inset ring-white/15 hover:bg-slate-900/80"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
