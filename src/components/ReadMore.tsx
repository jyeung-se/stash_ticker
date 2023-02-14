
const ReadMore = ({ children, setIsReadMore, isReadMore }: {children: any; setIsReadMore: React.Dispatch<React.SetStateAction<boolean>>; isReadMore: boolean}) => {
    const text = children;
    const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
    }
    return (
    <h3 className="read-more">
        {isReadMore ? text.slice(0, 350) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? "...read more" : " show less"}
        </span>
    </h3>
    )
}

export default ReadMore