import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  info: string
  imageUrl?: string
  category: string
}

interface Enquiry {
  id: string
  product: string
  askedBy: string
  date: string
  count: number
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Samsung TV 43"', price: 45000, stock: 8,  category: 'Electronics', info: 'Full HD 1080p, Smart TV, Wi-Fi built-in, HDMI x3, USB x2. Energy Class A+.', imageUrl: '' },
  { id: 'P002', name: 'HP Laptop 15"',  price: 65000, stock: 5,  category: 'Computers',   info: 'Intel Core i5-12th Gen, 8GB RAM, 512GB SSD, Windows 11 Home. Weight: 1.75kg.', imageUrl: '' },
  { id: 'P003', name: 'Air Fryer 5.5L', price: 8900,  stock: 14, category: 'Kitchen',     info: 'Capacity: 5.5L, Power: 1800W, Temperature range: 80–200°C. Dishwasher-safe basket.', imageUrl: '' },
  { id: 'P004', name: 'Blender Pro',    price: 3500,  stock: 22, category: 'Kitchen',     info: 'Power: 1200W, 2L jug, 6-blade stainless steel, 3 speed settings + pulse.', imageUrl: '' },
  { id: 'P005', name: 'iPhone 15',      price: 120000, stock: 3, category: 'Phones',      info: '6.1" Super Retina XDR, A16 Bionic chip, 128GB, 12MP camera, USB-C, 5G.', imageUrl: '' },
]

// Products customers asked for that are not in catalog
const INITIAL_ENQUIRIES: Enquiry[] = [
  { id: 'E001', product: 'LG OLED TV 55"',         askedBy: '+254712345678', date: '2026-04-18', count: 4 },
  { id: 'E002', product: 'Nikon D3500 Camera',      askedBy: '+254723456789', date: '2026-04-17', count: 2 },
  { id: 'E003', product: 'Samsung Galaxy S24',      askedBy: '+254734567890', date: '2026-04-17', count: 7 },
  { id: 'E004', product: 'Pressure Cooker 10L',     askedBy: '+254745678901', date: '2026-04-16', count: 3 },
  { id: 'E005', product: 'Sony WH-1000XM5 Headphones', askedBy: '+254756789012', date: '2026-04-15', count: 5 },
]

const EMPTY_FORM = { name: '', price: '', stock: '', info: '', imageUrl: '', category: '' }

export function CatalogPage() {
  const [products, setProducts]     = useState<Product[]>(INITIAL_PRODUCTS)
  const [enquiries, setEnquiries]   = useState<Enquiry[]>(INITIAL_ENQUIRIES)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [saved, setSaved]           = useState(false)
  const [search, setSearch]         = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())     e.name     = 'Product name is required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
                               e.price    = 'Enter a valid price'
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
                               e.stock    = 'Enter a valid stock quantity'
    if (!form.info.trim())     e.info     = 'Add product info / specifications'
    if (!form.category.trim()) e.category = 'Category is required'
    return e
  }

  function handleAdd() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const newProduct: Product = {
      id: `P${String(products.length + 1).padStart(3, '0')}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      info: form.info.trim(),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim(),
    }
    setProducts(prev => [newProduct, ...prev])
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleAddToStock(enquiry: Enquiry) {
    setEnquiries(prev => prev.filter(e => e.id !== enquiry.id))
    setForm({ name: enquiry.product, price: '', stock: '', info: '', imageUrl: '', category: '' })
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Product Catalog</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{products.length} products · DukaBot uses this to answer customer queries</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600 font-medium">✓ Product added</span>}
          <button
            onClick={() => { setShowForm(v => !v); setErrors({}) }}
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Add product form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product Name *" error={errors.name}>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Samsung Galaxy S24"
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label="Category *" error={errors.category}>
                <input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Phones, Kitchen, Computers"
                  className={inputCls(!!errors.category)}
                />
              </Field>
              <Field label="Price (KES) *" error={errors.price}>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 45000"
                  className={inputCls(!!errors.price)}
                />
              </Field>
              <Field label="Stock Quantity *" error={errors.stock}>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  placeholder="e.g. 10"
                  className={inputCls(!!errors.stock)}
                />
              </Field>
            </div>
            <Field label="Product Info / Specifications *" error={errors.info}>
              <textarea
                value={form.info}
                onChange={e => setForm(f => ({ ...f, info: e.target.value }))}
                placeholder="Describe the product — include ingredients, specifications, dimensions, warranty, etc."
                rows={3}
                className={inputCls(!!errors.info) + ' resize-none'}
              />
            </Field>
            <Field label="Image URL (optional)">
              <input
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://example.com/product-image.jpg"
                className={inputCls(false)}
              />
            </Field>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                className="rounded-lg px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                Save Product
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}) }}
                className="rounded-lg px-5 py-2 text-sm border border-border hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products by name or category…"
        className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      />

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Products ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Info / Specs</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.category}</Badge>
                  </TableCell>
                  <TableCell>KES {p.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={p.stock <= 5 ? 'text-red-500 font-semibold' : ''}>{p.stock}</span>
                    {p.stock <= 5 && <span className="ml-1 text-xs text-red-400">low</span>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={p.info}>
                    {p.info}
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.imageUrl
                      ? <a href={p.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">View</a>
                      : <span className="text-muted-foreground">—</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No products found. Add your first product above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Unavailable product enquiries */}
      {enquiries.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold">Unavailable Product Enquiries</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Products customers asked for that DukaBot could not find in your catalog. Add them to your stock to capture these sales.
              </p>
            </div>
            <Card className="border-orange-200 dark:border-orange-900">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Requested</TableHead>
                      <TableHead>Times Asked</TableHead>
                      <TableHead>Last Asked By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enq) => (
                      <TableRow key={enq.id}>
                        <TableCell className="font-medium">{enq.product}</TableCell>
                        <TableCell>
                          <Badge variant={enq.count >= 5 ? 'default' : 'secondary'}>
                            {enq.count}×
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{enq.askedBy}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{enq.date}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleAddToStock(enq)}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
                          >
                            + Add to Stock
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border ${hasError ? 'border-red-400' : 'border-border'} bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all`
}
