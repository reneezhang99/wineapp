export default function Question({ question, onAnswer }) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl mb-8 font-serif">
        {question.text}
      </h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
} 