import ListGroup from 'react-bootstrap/ListGroup';

const Palette = ({colors, getColor}) =>{

    function handlePaletteColorClick(paletteColor){
        console.log(paletteColor);
        getColor(paletteColor);
    }

    function getColorFromStyle(style) {
        return style.backgroundColor || '';
    }

    function rgbToHex(rgb) {
        // Separazione dei valori RGB
        const [r, g, b] = rgb.match(/\d+/g);
        // Conversione in formato HEX
        return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
    }

    return (
        <>
        <ListGroup horizontal className='paletteDiv'>
            {colors.map((color,index) => (
                <ListGroup.Item
                key={index}
                className='paletteDivElements'
                style={{background : color}}
                onClick={(e) => (handlePaletteColorClick(rgbToHex(getColorFromStyle(e.target.style))))}
                ></ListGroup.Item>

            ))}
        </ListGroup>
        
    </>
    );
}

export default Palette;