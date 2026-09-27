import React,{useContext} from "react";
import noteContext from '../context/noteContext';

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note ,updateNote} = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align item-center">
            <h5 className="card-title">{note.title}</h5>
            
           <span
           style={{cursor:"pointer"}} 
           onClick={()=>{deleteNote(note._id)
            props.showAlert("Note deleted successfully", "danger");
           }}
           
           >
            <i className="fa-solid fa-trash mx-2"></i>
           </span>
           <span
           style={{cursor:"pointer"}}
           onClick={()=>{updateNote(note)
           }}
           >
            <i className="fa-solid fa-pen-to-square mx-3" ></i>
          </span>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
