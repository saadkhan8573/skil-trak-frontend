import { StarRating } from '@components'
import { useState } from 'react'

const TRUNCATED_LIMIT = 180
export const ReviewSlide = ({ content }: any) => {
    const [shortText, setShortText] = useState(
        content.review.length > TRUNCATED_LIMIT
            ? content.review.substring(0, TRUNCATED_LIMIT)
            : content.review
    )
    const [isTextTruncated, setIsTextTruncated] = useState(
        content.review.length > TRUNCATED_LIMIT
    )
    const [showFullText, setShowFullText] = useState(
        !(content.review.length > TRUNCATED_LIMIT)
    )
    const [fullText, setFullText] = useState(content.review)

    return (
        <div
            className="
          review-card
          bg-white
          rounded-xl
          w-full
          md:h-96
          flex flex-col
          sm:flex-row
          items-center
          sm:overflow-hidden md:p-0
        "
        >
            <StarRating
                count={5}
                value={5}
                edit={false}
                size={20}
                activeColor={'orange'}
            />
            <div
                className="
            w-32
            h-32
            rounded-full
            sm:rounded-none sm:w-64  sm:h-full
            my-4
            sm:my-0
            flex-shrink-0
          "
                style={{
                    backgroundImage: `url(${content.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                }}
            ></div>

            <div className="review-detail px-3 pb-3 lg:py-8 lg:px-10 flex-grow-0">
                <div
                    className="
              reviewer-info-wrapper
              flex flex-col
              lg:flex-row
              md:justify-between
              justify-center
              items-center
              md:items-start
            "
                >
                    <div className="reviewer-info">
                        <h5 className="reviewer-name font-bold text-2xl">
                            {content.name}
                        </h5>
                        <p
                            className="
                  reviewer-designation
                  font-medium
                  text-gray-600
                "
                        >
                            {content.designation
                                ? content.designation
                                : 'Valueable User'}
                        </p>
                    </div>
                    <div className="rating my-3 lg:my-0">
                        <StarRating
                            count={5}
                            value={5}
                            edit={false}
                            size={20}
                            activeColor={'orange'}
                        />
                    </div>
                </div>

                <p
                    className="
              review-text
              mt-3
              text-gray-500 text-center
              md:text-left
            "
                >
                    {showFullText ? fullText : `${shortText}...`}
                </p>
                {isTextTruncated && (
                    <div className="text-center py-3 text-theme-secondary">
                        <button onClick={() => setShowFullText(!showFullText)}>
                            {showFullText ? 'Show Less' : ' Show Full'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
