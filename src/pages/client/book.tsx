import {useParams} from "react-router-dom";
import {useEffect} from "react";
import SeeBookDetail from "components/client/book/see.book.detail";

const BookPage = () => {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            //do something
            console.log("book id = ", id)
        }
    }, [id]);

    return (
        <SeeBookDetail />
    )
}

export default BookPage;