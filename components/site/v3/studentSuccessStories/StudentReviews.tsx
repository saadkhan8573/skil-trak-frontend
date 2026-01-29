import { InitialAvatar } from '@components/InitialAvatar'
import { StarRating } from '@components/StarRating'
import { Typography } from '@components/Typography'
import { ellipsisText } from '@utils'

const reviews = [
    {
        name: 'Ajmal Jannoo',
        review: `I used SkillTrak to find a work placement in community services, and I had a truly amazing experience working with Melanie.
            Right from the start, Melanie helped me a lot. She was patient all the time, even with all my questions. She always called to check in and made sure I felt supported through the whole process, making a hard search feel smooth. ​When I wasn't sure about finding the right placement, Melanie was there. She reassured me and gave me great advice. Because of her help, I found the perfect work placement that I really enjoy. She is a great consultant who truly cares about helping people. I strongly recommend Skill Track, especially for Melanie's dedicated and kind service!

            To the Skill Track Management Team:
        Please recognize the outstanding work of Melanie. She is a huge asset to your company, demonstrating exceptional professionalism and client focus. Her dedication goes above and beyond, and she directly contributes to client succes`,
        rating: 5,
        link: 'https://share.google/o8fkXmMKtycvpqzUS',
    },
    {
        name: 'Kriti Devi',
        review: `We have had a wonderful experience working with this team. They are very friendly, professional, and always smooth and easy to work with. They have consistently supported our facility by sending many students for placement, and they remain flexible in accommodating our requests when arranging student schedules. Daniel, in particular, demonstrates excellent communication and collaborates effectively with our management team. Overall, we are very satisfied and highly value this partnership.`,
        rating: 5,
        link: 'https://share.google/jwQPZS8FidkRiQ2Mx',
    },
    {
        name: 'Tasha World',
        review: `I would like to express my sincere gratitude to Miss Nadia for her exceptional support and guidance in securing my placement. She was incredibly helpful throughout the entire process — from preparing my application to offering valuable advice and encouragement at every step.
        Her professionalism, dedication, and proactive approach made a real difference, and I truly appreciate the time and effort she invested in helping me achieve this opportunity.
        I couldn't have asked for better support, and I highly recommend Miss Nadia to anyone seeking guidance with their career or placement journey. Thank you once again for everything!`,
        rating: 5,
        link: 'https://share.google/diA3YY6SpEV9zJ4Bn',
    },

]

export const StudentReviews = () => {
    return (
        <div className="flex flex-col gap-y-4 md:gap-y-40 relative px-4 md:px-0">
            {reviews?.map((review, index) => (
                <a href={review.link} target="_blank" rel="noreferrer"
                    key={index}
                    className={`rounded-xl ${index === 1
                        ? 'bg-[#F7A619] md:absolute -left-20 top-[8.5rem]'
                        : 'bg-[#D9D9D9]'
                        } flex items-center p-5 gap-x-5 max-w-[580px]`}
                >
                    <div className="flex flex-col items-center justify-center">
                        <InitialAvatar name="Jimmy III" />
                        <Typography variant="label">{review?.name}</Typography>
                    </div>
                    <div className="bg-[linear-gradient(90deg,#D9D9D9_18.25%,#2E5793_43.75%,#D9D9D9_86.25%)] w-px h-10"></div>
                    <div className="" title={review?.review}>
                        <Typography variant="small">
                            {ellipsisText(review?.review, 200)}
                        </Typography>
                        <div className="flex justify-end">
                            <StarRating
                                count={5}
                                value={review?.rating}
                                edit={false}
                                size={25}
                                activeColor={index === 1 ? "#043873" : '#F9A307'}
                            />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}
