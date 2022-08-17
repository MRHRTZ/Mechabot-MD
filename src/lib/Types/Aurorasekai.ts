type resultMovieSearch = {
    status: boolean;
    result: Array<movieSearchRow> | undefined;
}

interface movieSearchRow {
    title: string;
    link: string | undefined;
    thumbnail: string | undefined;
    description: string;
    rating: string;
}

export {
    resultMovieSearch,
    movieSearchRow
}