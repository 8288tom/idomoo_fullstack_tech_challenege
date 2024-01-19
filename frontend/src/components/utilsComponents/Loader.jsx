/* eslint-disable react/prop-types */
import "../../sass/components/_loader.scss"
export default function Loader({size ="medium", color="black"}){
    const sizeStyles = {
        small: { width: "4rem", height: "1.5rem" },
        medium: { width: "7rem", height: "3rem" },
        large: { width: "9rem", height: "6rem" }
    };
    const colorStyles = {
        pink:{ background: 'radial-gradient(circle closest-side, #f1baba 90%, #0000) 0/calc(100%/3) 100% space'},
        blue:{ background: 'radial-gradient(circle closest-side, #bae0f1 90%, #0000) 0/calc(100%/3) 100% space'},
        black:{ background: 'radial-gradient(circle closest-side, #333 90%, #0000) 0/calc(100%/3) 100% space'},
        green:{ background: 'radial-gradient(circle closest-side, #07b385 90%, #0000) 0/calc(100%/3) 100% space'},
    }
    const loaderStyle={
        ...colorStyles[color],
        ...sizeStyles[size]
    }
    return(<>
    <div className="loaders" style={loaderStyle}></div>
    </>)
}
