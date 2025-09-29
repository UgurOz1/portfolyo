import { useEffect, useMemo, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'

type Post = {
  id: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string
}

export default function Blog() {
  const [blogSearch, setBlogSearch] = useState('')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<null | { uid: string; email: string | null }>(null)
  const [editMode, setEditMode] = useState(false)
  const [editPost, setEditPost] = useState<Post | null>(null)

  // Google ile giriş: popup başarısız olursa redirect'e düş
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err: any) {
      // Mobil/Safari veya popup engelliyse
      await signInWithRedirect(auth, new GoogleAuthProvider())
    }
  }

  useEffect(() => {
    // Blog yazılarını her zaman yükle (giriş yapılmış olsun ya da olmasın)
    const loadPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
        const snap = await getDocs(q)
        const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[]
        setPosts(result)
      } catch (error) {
        console.error('Blog yazıları yüklenemedi:', error)
        setPosts([])
      }
    }

    // İlk yükleme
    loadPosts()

    // Auth state değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? { uid: user.uid, email: user.email } : null)
    })

    // Redirect akışından dönüldüyse sonucu al (hata yakalamak için)
    getRedirectResult(auth).catch(() => {})

    return unsubscribe
  }, [])

  const filteredBlogPosts = useMemo(() => {
    const qStr = blogSearch.trim().toLowerCase()
    if (!qStr) return posts
    return posts.filter((p) => [p.title, p.excerpt, ...(p.tags || [])].some((t) => t.toLowerCase().includes(qStr)))
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
    const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[]
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
      const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[]
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
      const result = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[]
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
            <Link to="/" className="text-xl font-bold text-white hover:text-sky-300 transition-colors">
              ← Ana Sayfa
            </Link>
            <h1 className="text-2xl font-bold text-white">Blog</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/admin" 
                    className="rounded-lg bg-sky-500/20 px-3 py-1.5 text-sky-300 ring-1 ring-inset ring-sky-500/30 hover:bg-sky-500/30 hover:text-sky-200 transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <span className="text-sm text-slate-300">{user.email}</span>
                  <button
                    onClick={() => signOut(auth)}
                    className="rounded-lg bg-red-500/20 px-3 py-1.5 text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/30 hover:text-red-200 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-inset ring-white/15 hover:bg-white/20"
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Blog Bölümü */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Blog</h2>
            <p className="mt-2 text-sm text-slate-400">Notlar, ipuçları ve öğrendiklerim.</p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Sol: Liste ve arama */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Arama */}
                <div className="space-y-4">
                  <input
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder="Ara: React, Tailwind..."
                    className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  />
                  
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
                </div>
                
                {/* Blog yazıları listesi */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Yazılar</h3>
                  {filteredBlogPosts.map((post) => (
                    <div key={post.id} className="group">
                      <button
                        onClick={() => setSelectedPostId(post.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                          selectedPostId === post.id
                            ? 'border-sky-500/50 bg-sky-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white line-clamp-2">{post.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((t) => (
                                <span key={t} className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300">
                                  {t}
                                </span>
                              ))}
                              {post.tags.length > 2 && (
                                <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300">
                                  +{post.tags.length - 2}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        
                        {/* Admin işlem butonları */}
                        {user && (
                          <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPostId(post.id)
                                setEditMode(true)
                                setEditPost(post)
                              }}
                              className="rounded bg-sky-500/20 px-2 py-1 text-xs text-sky-300 hover:bg-sky-500/30 transition-colors"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deletePost(post.id)
                              }}
                              className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300 hover:bg-red-500/30 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: Blog yazısı içeriği */}
            <div className="xl:col-span-2">
              {(() => {
                const active = selectedPostId
                  ? posts.find((p) => p.id === selectedPostId)
                  : posts[0]
                if (!active) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-slate-400">Henüz yazı yok</p>
                    </div>
                  )
                }
                return (
                  <article className="prose prose-invert prose-slate max-w-none">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 ring-1 ring-inset ring-white/10">
                      {/* Header */}
                      <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-4">{active.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                          <span>{new Date(active.date).toLocaleDateString('tr-TR')}</span>
                          <span>•</span>
                          <span>{active.content.length} karakter</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {active.tags.map((t) => (
                            <span key={t} className="rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </header>
                      
                      {/* Content */}
                      <div className="prose prose-invert prose-slate max-w-none">
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                          {active.content}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })()}
            </div>
          </div>
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
    } else if (open && !editMode) {
      // Yeni yazı oluşturma modunda form'u temizle
      setTitle('')
      setTags('React,TypeScript')
      setContent('')
    }
  }, [editPost, editMode, open])

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
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        <p className="mb-3">Admin olarak giriş yaparsanız blog yazısı oluşturabilirsiniz.</p>
        <div className="flex gap-2">
          {userEmail ? (
            <button onClick={onLogout} className="rounded-lg bg-white/10 px-3 py-1.5 text-white ring-1 ring-inset ring-white/15 hover:bg-white/20 transition-colors">
              Çıkış Yap ({userEmail})
            </button>
          ) : (
            <button onClick={onLogin} className="rounded-lg bg-white/10 px-3 py-1.5 text-white ring-1 ring-inset ring-white/15 hover:bg-white/20 transition-colors">
              Google ile Giriş Yap
            </button>
          )}
        </div>
      </div>
    )

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setEditMode(false)
          setEditPost(null)
          setOpen((v) => !v)
        }}
        className="w-full rounded-lg bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:opacity-95 transition-opacity"
      >
        {open ? (editMode ? 'Düzenlemeyi Gizle' : 'Yeni Yazıyı Gizle') : 'Yeni Yazı Oluştur'}
      </button>

      {open && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 ring-1 ring-inset ring-white/10">
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık"
              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Etiketler: React,TypeScript"
              className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="İçerik"
              className="w-full resize-y rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                {editMode ? 'Güncelle' : 'Yayınla'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-white ring-1 ring-inset ring-white/15 hover:bg-slate-900/80 transition-colors"
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
