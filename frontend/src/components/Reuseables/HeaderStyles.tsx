
interface HeaderStylesInterface {
    header_title: string;
}

const HeaderStyles = ({ header_title }: HeaderStylesInterface) => {
    return (
        <h1 className=" text-3xl font-bold text-center">
            {header_title}
        </h1>
    )
}

export default HeaderStyles
