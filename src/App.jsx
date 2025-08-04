import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [artStyle, setArtStyle] = useState("Neoclassicism")
  const [cardNum, setCardNum] = useState(6)
  const [totalPages, setTotalPages] = useState(0)
  const [artPieces, setArtPieces] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchArtworkDetails = async (artwork) => {
    try {
      const response = await fetch(artwork.api_link)
      if (!response.ok) {
        throw new Error(`Failed to fetch artwork details: ${response.status}`)
      }
      
      const res = await response.json()
      if (!res.data.image_id) {
        return null
      }
      
      return `${res.config.iiif_url}/${res.data.image_id}/full/843,/0/default.jpg`
    } catch (err) {
      console.error(`Error fetching artwork ${artwork.id}:`, err.message)
      return null
    }
  }

  const fetchArt = async () => {
    setLoading(true)
    setError(null)
    
    const url = `https://api.artic.edu/api/v1/artworks/search?query[match][style_titles]=${artStyle}&limit=${cardNum}`
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch artworks: ${response.status}`)
      }

      const res = await response.json()
      setTotalPages(Math.ceil(res.pagination.total / cardNum))

      const imagePromises = res.data.map(artwork => fetchArtworkDetails(artwork))
      const imageResults = await Promise.all(imagePromises)
      const validImages = imageResults.filter(image => image !== null)
      setArtPieces(validImages)
    } catch (err) {
      console.error('Error in fetchArt:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArt()
  }, [])

  useEffect(() => {
    fetchArt()
  }, [artStyle, cardNum])

  return (
    <>
      <h1>Art Memory Card Game</h1>
      <div className="card">
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {loading && <p>Loading artwork...</p>}
        <button onClick={fetchArt} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Art'}
        </button>
        {totalPages > 0 && (
          <p>Found {totalPages} pages of {artStyle} artwork</p>
        )}
        {artPieces.length > 0 && (
          <div>
            <p>Loaded {artPieces.length} images</p>
          </div>
        )}
      </div>
    </>
  )
}

export default App
