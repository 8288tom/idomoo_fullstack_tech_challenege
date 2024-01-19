import "../../sass/components/_button.scss"

export default function Button({text}){
    return(
        <>
        <button type="submit" className="btn flex-center btn--light-green">{text}</button>
        </>
    )

}