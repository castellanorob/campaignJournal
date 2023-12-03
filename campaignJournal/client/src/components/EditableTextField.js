import React, { useState } from 'react';
import axios from 'axios';
import { APIURL } from "../helpers/APIURL";

const EditableTextField = ({initialText, entry}) => {
    const [editable, setEditable] = useState(false);
    const [text, setText] = useState(initialText);

    const onButtonClick = () => {
        console.log(entry.journalBody);
        if (editable) {
            const entryData = {
                entryBody: text,
                entryId: entry.id
            }
            axios.put(`${APIURL}JournalEntry/byId/${entry.id}`, entryData,)
            .then((response) =>{
                if(response.data.error){
                    alert(response.data.error);
                }
            });
        }
        setEditable(!editable);
    };
        

    const handleTextChange = (edit) => {
        setText(edit.target.value)
    };

    return (
        <div>
          <br />
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            readOnly={!editable}
            style={{width: "700px", height: "500px", backgroundColor: "beige"}}
          />
          <button 
          onClick={onButtonClick}
          style={{display: "block"}}
          >
            {editable ? 'Save' : 'Edit'}
          </button>
        </div>
      );
};

export default EditableTextField;