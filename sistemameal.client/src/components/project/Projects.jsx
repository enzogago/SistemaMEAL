import { useEffect, useState } from "react";
import Table from "./Table";
import { fetchData } from "../reusable/helper";

const projects = () => {
    // States locales
    const [ data, setData ] = useState([])

    useEffect(() => {
        fetchData('Proyecto',setData)
    }, []);

    return (
        <>
            <Table 
                data={data}
                setData= {setData}
            />
        </>
    );
};

export default projects;
