import { useContext } from 'react';
import ProjectContext from '../context/ProjectContext';

const ProjectList = () => {
    const { projects } = useContext(ProjectContext);

    return (
        <div>
            <h2>Proyectos</h2>
            {projects.map((project, index) => (
                <div key={index} className="border p-3 mb-3">
                    <h3>{project.id}</h3>
                    <p>{project.attributes}</p>
                    <h4>Subproyectos</h4>
                    {project.subProjects.map((subProject, index) => (
                        <div key={index} className="border p-2 mb-2">
                            <h4>{subProject.id}</h4>
                            <p>{subProject.name}</p>
                            <p>{subProject.description}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ProjectList;
