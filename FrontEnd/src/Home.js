// import { useState } from "react";
import { useEffect, useState } from "react";
import FilesDiv from "./FilesDiv";
import axios from 'axios';
import { faAnchorCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { update } from "lodash";
import { Table } from "react-bootstrap";

const Home = () => {

    const filesDivArray = [];

    const [fileData, setFileData] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if(localStorage.getItem("userEmail") !== null && fileData.length <= 0){
            getUserData();
        }
        
        //mettere isLoading per caricare solamente una volta e non continuamente
    },[isLoading])

    //chiamarlo da useEffect
    const getUserData = () =>{
        const userData = {
            email : localStorage.getItem("userEmail")
            // email : "carlino@example.it" // debug
        }

        axios.post('http://localhost/api_crud_php/file/getFileByEmail.php', userData)
        .then(response => {
            const newData = response.data.records.map(record => ({
                nome: record.nome,
                nFrame: record.nFrame,
                pixel_size: record.pixel_size,
                file_colori: record.file_colori,
                created_at: record.created_at,
                updated_at: record.updated_at
            }));

            setFileData(newData);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(()=>{
            setIsLoading(false);
        })

    }

    const renderFilesDiv = () =>{

        //TODO - vado a clonare fileData 
        //          -> prendo il primo elemento e ricerco quanti elementi ci sono con lo stesso nome
        //          -> dopodichè li elimino tutti tranne l'ultimo, e poi continuo la ricerca con gli altri elementi, se ci sono
        //          -> 

        // const fileDataClone = fileData.slice();


        // // vado a prendere i nomi in modo univoco
        // const nomiUnivociSet = new Set();

        // fileData.forEach(fileDiv => {
        //     nomiUnivociSet.add(fileDiv.nome);
        // });

        // const nomiUnivoci = Array.from(nomiUnivociSet);
        // //console.log(nomiUnivoci); // debug
        //-----------------------------

        //
        // for(let i = 0; i < nomiUnivoci.length; i++){
        //     let contatoreNomiTrovati = 0;
        //     let contatoreElementiEliminati = 0;
        //     for(let j = 0; j < fileDataClone.length; j++) {
        //         if(fileDataClone[j].nome == nomiUnivoci[i]){
        //             contatoreNomiTrovati++;
        //         }
        //     }
        //     for(let j = 0; j < fileDataClone.length; j++) {
        //         if(fileDataClone[j].nome == nomiUnivoci[i]){
        //             contatoreElementiEliminati++;
        //             if(){

        //             }
        //         }
        //     }

        // }

        
        for (let i = 0; i < fileData.length; i++) {
            filesDivArray.push(<FilesDiv key={i} nome = {fileData[i].nome} nFrame = {fileData[i].nFrame} file_colori = {fileData[i].file_colori} pixel_size = {fileData[i].pixel_size} created_at = {fileData[i].created_at} updated_at = {fileData[i].updated_at} />);
        }

        return filesDivArray
    }

    return ( 
        <div className="contentHome">
            <h3>Recent Files: </h3>
            <section style={{
                border: "2px solid black",
                borderRadius : "5px",
                width: "100%",
                height: "500px",
            }}>
            <Table responsive hover>
                <thead>
                    <tr>
                        <th style={{width : "30%"}}>File_Name</th>
                        <th style={{width : "10%"}}>Frames_Num</th>
                        <th style={{width : "30%"}}>Pixe_Size</th>
                        <th>Created_at</th>
                        <th>Updated_at</th>

                    </tr>
                </thead>
                <tbody>
                    {renderFilesDiv()}
                </tbody>
            </Table>
            
            </section>
        </div>
     );
}
 
export default Home;