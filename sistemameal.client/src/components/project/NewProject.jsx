const NewProject = () => {
    return (
        <>
            <div>
                Formulario
            </div>
            {/* <Subprojects /> */}
        </>


    )
}



export default NewProject;
//import { useState, useContext } from 'react';
//import ProjectContext from '../context/ProjectContext';
//import SubProject from './SubProject.jsx';

//const ProjectCreation = () => {
//    const { projects, setProjects } = useContext(ProjectContext);

//    const [project, setProject] = useState({ id: '', attributes: '' });
//    const [subProjects, setSubProjects] = useState([]);

//    const handleInputChange = (e) => {
//        setProject({ ...project, [e.target.name]: e.target.value });
//    };

//    const handleSubProjectCreation = () => {
//        setSubProjects([...subProjects, { id: '', name: '', description: '' }]);
//    };

//    const handleSubProjectChange = (index, event) => {
//        const values = [...subProjects];
//        values[index][event.target.name] = event.target.value;
//        setSubProjects(values);
//    };

//    const handleSaveProject = () => {
//        setProjects([...projects, { ...project, subProjects }]);
//        setProject({ id: '', attributes: '' }); // Restablece el estado del proyecto
//        setSubProjects([]); // Restablece el estado de los subproyectos
//    };


//    return (
//        <div className="row">
//            <div className="col">
//                <h2>Crear Proyecto</h2>
//                <input
//                    type="text"
//                    name="id"
//                    value={project.id}
//                    onChange={handleInputChange}
//                    placeholder="ID del Proyecto"
//                />
//                <input
//                    type="text"
//                    name="attributes"
//                    value={project.attributes}
//                    onChange={handleInputChange}
//                    placeholder="Atributos del Proyecto"
//                />
//                <button onClick={handleSaveProject}>Guardar Proyecto</button>
//            </div>
//            <div className="col">
//                <h2>Subproyectos</h2>
//                {subProjects.map((subProject, index) => (
//                    <SubProject
//                        subProject={subProject}
//                        index={index}
//                        key={index }
//                        handleSubProjectChange={handleSubProjectChange}
//                    />
//                ))}
//                <button onClick={handleSubProjectCreation}>Nuevo Subproyecto</button>
//            </div>
//        </div>
//    );
//};

//export default ProjectCreation;
