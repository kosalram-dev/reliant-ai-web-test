export type TRating = {
    rate: number;
    count: number;
};

export type TProduct = {
    price: number;
    title: string;
    id: number;
    description: string;
    category: string;
    image: string;
    rating: TRating;
};
