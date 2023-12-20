const SubProject = ({ subProject, index, handleSubProjectChange }) => (
    <div key={index}>
        <input
            type="text"
            name="id"
            value={subProject.id}
            onChange={(event) => handleSubProjectChange(index, event)}
            placeholder="ID del Subproyecto"
        />
        <input
            type="text"
            name="name"
            value={subProject.name}
            onChange={(event) => handleSubProjectChange(index, event)}
            placeholder="Nombre del Subproyecto"
        />
        <input
            type="text"
            name="description"
            value={subProject.description}
            onChange={(event) => handleSubProjectChange(index, event)}
            placeholder="Descripci�n del Subproyecto"
        />
    </div>
);

export default SubProject;
