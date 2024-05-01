import { Link } from "react-router-dom";

const FilesDiv = ({ nome, nFrame, pixel_size, file_colori, created_at, updated_at }) => {

    const handleFileDivClick = () => {
        console.log(file_colori);
    }

    return (
        <tr onClick={handleFileDivClick} style={{ cursor: 'pointer' }}>
            <td style={{ width: "30%" }}>
                <Link to={`/NewFile/pixel=${pixel_size}&name=${nome}`}>
                    {nome}
                </Link>
            </td>
            <td style={{ width: "10%" }}>{nFrame}</td>
            <td style={{ width: "30%" }}>{pixel_size}</td>
            <td>{created_at}</td>
            <td>{updated_at}</td>
        </tr>
    );
}

export default FilesDiv;