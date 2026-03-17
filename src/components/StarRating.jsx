import { useState } from 'react'

export default function StarRating({ rating = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`text-2xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <span className={`${(hover || rating) >= star ? 'text-ci-hellblau' : 'text-gray-300'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}
