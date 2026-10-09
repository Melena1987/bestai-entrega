import { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

const LABELS = [
  { value: 'Nuevo Proyecto', color: '#22c55e' },
  { value: 'Destacado', color: '#3b82f6' },
  { value: 'En Construcción', color: '#f59e0b' },
  { value: 'Vendido', color: '#ef4444' },
  { value: 'Exclusivo', color: '#a855f7' },
  { value: 'Últimas Unidades', color: '#f97316' },
  { value: 'Preventa', color: '#06b6d4' },
];

const inputStyle = {
  padding: '0.8rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-light)',
  color: 'var(--color-text)',
  width: '100%',
  boxSizing: 'border-box',
};

const LocationInput = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [mapsUrl, setMapsUrl] = useState('');
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val, '');
    setSuggestions([]);
    clearTimeout(debounceRef.current);
    if (val.length < 3) return;
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {}
    }, 400);
  };

  const handleSelect = (item) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`;
    onChange(item.display_name.split(',').slice(0, 3).join(', '), url);
    setMapsUrl(url);
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Buscar ubicación (ej: Marbella, Málaga)"
        value={value}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      {mapsUrl && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', display: 'block', marginTop: '0.3rem' }}>
          ✓ Ubicación con enlace a Google Maps guardada
        </span>
      )}
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: 'var(--card-bg)', border: '1px solid var(--border-color)',
          borderRadius: '0.5rem', listStyle: 'none', margin: 0, padding: '0.5rem 0',
          maxHeight: '200px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              style={{ padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AdminArea = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [properties, setProperties] = useState([]);
  
  const [newProperty, setNewProperty] = useState({
    title: '', location: '', mapsUrl: '', type: '', desc: '', fullDesc: '', features: '',
    tir: '', plazo: '', objetivo: '',
    label: 'Nuevo Proyecto', published: false
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult(true);
        if (token.claims.admin) {
          setIsAdmin(true);
          fetchProperties();
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchProperties = async () => {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    const props = [];
    querySnapshot.forEach((d) => props.push({ id: d.id, ...d.data() }));
    setProperties(props);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageFile) { alert('Por favor, selecciona una imagen principal.'); return; }
    setUploading(true);
    try {
      // Main image upload
      const imageRef = ref(storage, `properties/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Gallery images upload
      const galleryUrls = [];
      for (const file of galleryFiles) {
        const fileRef = ref(storage, `properties/gallery_${Date.now()}_${file.name}`);
        const fileSnap = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileSnap.ref);
        galleryUrls.push(url);
      }

      const labelObj = LABELS.find(l => l.value === newProperty.label) || LABELS[0];
      const featuresArray = newProperty.features.split(',').map(f => f.trim()).filter(f => f);

      await addDoc(collection(db, 'properties'), {
        title: newProperty.title,
        location: newProperty.location,
        mapsUrl: newProperty.mapsUrl,
        type: newProperty.type,
        desc: newProperty.desc,
        fullDesc: newProperty.fullDesc,
        features: featuresArray,
        stats: {
          tir: newProperty.tir,
          plazo: newProperty.plazo,
          objetivo: newProperty.objetivo
        },
        img: downloadURL,
        gallery: galleryUrls,
        labelColor: labelObj.color,
        label: newProperty.label,
        published: newProperty.published
      });

      setNewProperty({ 
        title: '', location: '', mapsUrl: '', type: '', desc: '', fullDesc: '', features: '',
        tir: '', plazo: '', objetivo: '', label: 'Nuevo Proyecto', published: false 
      });
      setImageFile(null);
      setGalleryFiles([]);
      document.getElementById('image-upload').value = '';
      if(document.getElementById('gallery-upload')) document.getElementById('gallery-upload').value = '';
      
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert('Error al añadir la propiedad.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar esta propiedad?')) return;
    try {
      await deleteDoc(doc(db, 'properties', id));
      fetchProperties();
    } catch (err) { console.error(err); }
  };

  const handleTogglePublished = async (id, current) => {
    try {
      await updateDoc(doc(db, 'properties', id), { published: !current });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="container" style={{ paddingTop: '120px', minHeight: '80vh' }}>Cargando...</div>;

  if (!isAdmin) return (
    <div className="container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <h2 className="section-title">Acceso Denegado</h2>
      <p>Solo los administradores pueden ver esta página.</p>
    </div>
  );

  const published = properties.filter(p => p.published);
  const drafts = properties.filter(p => !p.published);

  return (
    <div className="container" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '4rem' }}>
      <h2 className="section-title">Área <span className="blue">Admin</span></h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        {published.length} publicadas · {drafts.length} borradores
      </p>

      {/* FORM */}
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>➕ Añadir Propiedad</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <input type="text" placeholder="Título (ej: Villa Mar VI)" value={newProperty.title}
            onChange={e => setNewProperty({ ...newProperty, title: e.target.value })} required style={inputStyle} />

          <LocationInput
            value={newProperty.location}
            onChange={(loc, url) => setNewProperty({ ...newProperty, location: loc, mapsUrl: url })}
          />

          <input type="text" placeholder="Tipo (ej: Villa de Lujo, Ático, Apartamento)" value={newProperty.type}
            onChange={e => setNewProperty({ ...newProperty, type: e.target.value })} required style={inputStyle} />

          <textarea placeholder="Descripción corta" value={newProperty.desc}
            onChange={e => setNewProperty({ ...newProperty, desc: e.target.value })} required style={inputStyle} rows={2} />

          <textarea placeholder="Descripción larga detallada (aparecerá en la página de la propiedad)" value={newProperty.fullDesc}
            onChange={e => setNewProperty({ ...newProperty, fullDesc: e.target.value })} style={inputStyle} rows={4} />

          <input type="text" placeholder="Características destacadas (separadas por coma, ej: Piscina, Gimnasio, Vistas al mar)" value={newProperty.features}
            onChange={e => setNewProperty({ ...newProperty, features: e.target.value })} style={inputStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="TIR Estimada (ej: 12%)" value={newProperty.tir}
              onChange={e => setNewProperty({ ...newProperty, tir: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Plazo previsto (ej: 18 meses)" value={newProperty.plazo}
              onChange={e => setNewProperty({ ...newProperty, plazo: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Objetivo (ej: Rentas)" value={newProperty.objetivo}
              onChange={e => setNewProperty({ ...newProperty, objetivo: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Etiqueta</label>
              <select value={newProperty.label}
                onChange={e => setNewProperty({ ...newProperty, label: e.target.value })}
                style={inputStyle}>
                {LABELS.map(l => (
                  <option key={l.value} value={l.value}>
                    {l.value}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={newProperty.published}
                  onChange={e => setNewProperty({ ...newProperty, published: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                Publicar inmediatamente
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Imagen Principal</label>
              <input id="image-upload" type="file" accept="image/*"
                onChange={e => setImageFile(e.target.files[0])} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Galería de imágenes (opcional, múltiples)</label>
              <input id="gallery-upload" type="file" accept="image/*" multiple
                onChange={e => setGalleryFiles(Array.from(e.target.files))} style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={uploading} className="btn btn-primary" style={{ width: 'fit-content', marginTop: '1rem' }}>
            {uploading ? '⏳ Subiendo archivos y guardando...' : '✅ Añadir Propiedad'}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Propiedades Actuales</h3>
        {properties.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay propiedades aún.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {properties.map(p => (
            <div key={p.id} style={{
              background: 'var(--card-bg)', padding: '1rem 1.5rem',
              borderRadius: '0.75rem', border: `1px solid ${p.published ? '#22c55e44' : 'var(--border-color)'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {p.img && <img src={p.img} alt={p.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <h4 style={{ margin: 0 }}>{p.title}</h4>
                    <span style={{ fontSize: '0.7rem', background: p.labelColor || '#22c55e', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {p.label || p.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: p.published ? 'rgba(21, 128, 61, 0.08)' : 'rgba(0, 0, 0, 0.04)', color: p.published ? '#15803d' : 'var(--color-text-muted)', padding: '0.15rem 0.50rem', borderRadius: '999px', border: `1px solid ${p.published ? 'rgba(21, 128, 61, 0.3)' : 'var(--color-border)'}` }}>
                      {p.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {p.mapsUrl
                      ? <a href={p.mapsUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>📍 {p.location}</a>
                      : `📍 ${p.location}`}
                    {p.type && ` · ${p.type}`}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => handleTogglePublished(p.id, p.published)}
                  className="btn btn-outline"
                  style={{ borderColor: p.published ? '#b45309' : '#15803d', color: p.published ? '#b45309' : '#15803d', fontSize: '0.8rem' }}>
                  {p.published ? '⏸ Despublicar' : '▶ Publicar'}
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-outline"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', fontSize: '0.8rem' }}>
                  🗑 Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminArea;
