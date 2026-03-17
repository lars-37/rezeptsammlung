import { jsPDF } from 'jspdf'

// CI-Farben
const CI = {
  blau: [140, 160, 184],     // #8CA0B8
  dunkel: [74, 101, 128],    // #4A6580
  hellblau: [0, 174, 239],   // #00AEEF
  weiss: [255, 255, 255],
  grau: [100, 100, 100],
  hellgrau: [220, 220, 220],
}

function drawStars(doc, x, y, rating, size = 5) {
  const starCount = 5
  for (let i = 0; i < starCount; i++) {
    if (i < rating) {
      doc.setTextColor(...CI.hellblau)
    } else {
      doc.setTextColor(...CI.hellgrau)
    }
    doc.setFontSize(size * 2.5)
    doc.text('★', x + i * (size + 2), y)
  }
  doc.setTextColor(0, 0, 0)
}

export function exportRecipePdf(recipe) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let y = 0

  // --- Header-Balken ---
  doc.setFillColor(...CI.dunkel)
  doc.rect(0, 0, pageWidth, 32, 'F')

  // Dünne Akzentlinie
  doc.setFillColor(...CI.hellblau)
  doc.rect(0, 32, pageWidth, 1.5, 'F')

  // Titel im Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...CI.weiss)
  doc.text(recipe.name, margin, 21)

  // Datum im Header rechts
  if (recipe.date) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...CI.blau)
    doc.text(recipe.date, pageWidth - margin, 21, { align: 'right' })
  }

  y = 42

  // --- Bewertung ---
  if (recipe.rating) {
    drawStars(doc, margin, y, recipe.rating, 6)
    y += 12
  }

  // --- Foto ---
  const allPhotos = recipe.photos?.length > 0 ? recipe.photos : recipe.photo ? [recipe.photo] : []

  if (allPhotos.length > 0) {
    try {
      const imgData = allPhotos[0]
      const imgWidth = contentWidth
      const imgHeight = 80
      doc.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight, undefined, 'MEDIUM')
      y += imgHeight + 8

      // Rahmen ums Bild
      doc.setDrawColor(...CI.blau)
      doc.setLineWidth(0.5)
      doc.rect(margin, y - imgHeight - 8, imgWidth, imgHeight)
    } catch {
      // Bild konnte nicht eingefügt werden, weiter ohne
    }
  }

  // --- Trennlinie ---
  doc.setDrawColor(...CI.blau)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // --- Beschreibung ---
  if (recipe.description) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...CI.dunkel)
    doc.text('Beschreibung', margin, y)
    y += 7

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...CI.grau)

    const lines = doc.splitTextToSize(recipe.description, contentWidth)
    for (const line of lines) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(line, margin, y)
      y += 6
    }
  }

  // --- Weitere Fotos auf Folgeseite ---
  if (allPhotos.length > 1) {
    doc.addPage()
    y = 20

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...CI.dunkel)
    doc.text('Weitere Fotos', margin, y)
    y += 10

    const photoSize = (contentWidth - 10) / 2
    allPhotos.slice(1).forEach((photo, i) => {
      if (y + photoSize > 280) {
        doc.addPage()
        y = 20
      }
      try {
        const xOffset = margin + (i % 2) * (photoSize + 10)
        doc.addImage(photo, 'JPEG', xOffset, y, photoSize, photoSize * 0.65, undefined, 'MEDIUM')
        doc.setDrawColor(...CI.blau)
        doc.setLineWidth(0.3)
        doc.rect(xOffset, y, photoSize, photoSize * 0.65)
        if (i % 2 === 1) y += photoSize * 0.65 + 8
      } catch {
        // Foto überspringen
      }
    })
  }

  // --- Footer auf jeder Seite ---
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFillColor(...CI.dunkel)
    doc.rect(0, 290, pageWidth, 7, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...CI.weiss)
    doc.text('Rezeptsammlung — Lars Bösel', margin, 294.5)
    doc.text(`Seite ${p} / ${pageCount}`, pageWidth - margin, 294.5, { align: 'right' })
  }

  // --- Speichern ---
  const filename = recipe.name.replace(/[^a-zA-Z0-9äöüÄÖÜß\s-]/g, '').replace(/\s+/g, '_')
  doc.save(`${filename}.pdf`)
}
