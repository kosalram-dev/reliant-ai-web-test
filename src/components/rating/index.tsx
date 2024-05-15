/**
 * Rating Component
 *
 * This component displays a rating using stars. It takes a 'rate' prop which represents
 * the rating out of 5 and renders filled, half-filled, or empty stars accordingly.
 */

import Image from "next/image";

import StarFull from "@/assets/star-full.png";
import StarHalf from "@/assets/star-empty.png";

import StarEmpty from "@/assets/star-empty.png";
import { TRating } from "@/types";

const Rating: React.FC<TRating> = ({ rate }) => {
  const filledStars = Math.floor(rate);
  const hasHalfStar = rate % 1 >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="pr-5">
      <ul className="flex flex-col justify-start">
        <div className="flex flex-row items-center justify-start">
          {[...Array(filledStars)].map((_, index) => (
            <li key={index} className="pr-5px">
              <Image src={StarFull} width={20} height={20} alt="full star" />
            </li>
          ))}
          {hasHalfStar && (
            <li className="pr-5px">
              <Image src={StarHalf} width={20} height={20} alt="half star" />
            </li>
          )}
          {[...Array(emptyStars)].map((_, index) => (
            <li key={index} className="pr-5px">
              <Image src={StarEmpty} width={20} height={20} alt="empty star" />
            </li>
          ))}
        </div>
        <div className="flex flex-row items-center justify-start py-2">
          <span className="text-xs px-2">{rate} out of 5</span>
        </div>
      </ul>
    </span>
  );
};

export default Rating;
