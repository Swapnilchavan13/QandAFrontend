import React, { useState } from 'react';
import '../styles/demo.css'; // Import your CSS file

export const Demo = () => {
  const [option, setOption] = useState(2);
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    setOption(parseInt(event.target.value));
    setFormData({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderFormFields = () => {
    const fields = [];
    const optionData = {
      2: [
        { name: "padx1", placeholder: "Pad X1" },
        { name: "padx2", placeholder: "Pad X2" },
        { name: "pady1", placeholder: "Pad Y1" },
        { name: "pady2", placeholder: "Pad Y2" },
        { name: "text1", placeholder: "Text 1 Font" },
        { name: "text2", placeholder: "Text 2 Font" },
        { name: "x1", placeholder: "X1" },
        { name: "x2", placeholder: "X2" },
        { name: "color", placeholder: "Color" }
      ],
      4: [
        { name: "padx1", placeholder: "Pad X1" },
        { name: "padx2", placeholder: "Pad X2" },
        { name: "padx3", placeholder: "Pad X3" },
        { name: "padx4", placeholder: "Pad X4" },
        { name: "pady1", placeholder: "Pad Y1" },
        { name: "pady2", placeholder: "Pad Y2" },
        { name: "pady3", placeholder: "Pad Y3" },
        { name: "pady4", placeholder: "Pad Y4" },
        { name: "text1", placeholder: "Text 1 Font" },
        { name: "text2", placeholder: "Text 2 Font" },
        { name: "text3", placeholder: "Text 3 Font" },
        { name: "text4", placeholder: "Text 4 Font" },

        { name: "x1", placeholder: "X1" },
        { name: "x2", placeholder: "X2" },
        { name: "x3", placeholder: "X3" },
        { name: "x4", placeholder: "X4" },
        { name: "y1", placeholder: "Y1" },
        { name: "y2", placeholder: "Y2" },
        { name: "y3", placeholder: "Y3" },
        { name: "y4", placeholder: "Y4" },
        { name: "color", placeholder: "Color" }
      ],
      5: [
        { name: "padx1", placeholder: "Pad X1" },
        { name: "padx2", placeholder: "Pad X2" },
        { name: "padx3", placeholder: "Pad X3" },
        { name: "padx4", placeholder: "Pad X4" },
        { name: "padx5", placeholder: "Pad X5" },
        { name: "pady1", placeholder: "Pad Y1" },
        { name: "pady2", placeholder: "Pad Y2" },
        { name: "pady3", placeholder: "Pad Y3" },
        { name: "pady4", placeholder: "Pad Y4" },
        { name: "pady5", placeholder: "Pad Y5" },
        { name: "text1", placeholder: "Text 1 Font" },
        { name: "text2", placeholder: "Text 2 Font" },
        { name: "text3", placeholder: "Text 3 Font" },
        { name: "text4", placeholder: "Text 4 Font" },
        { name: "text5", placeholder: "Text 5 Font" },

        { name: "x1", placeholder: "X1" },
        { name: "x2", placeholder: "X2" },
        { name: "x3", placeholder: "X3" },
        { name: "x4", placeholder: "X4" },
        { name: "x5", placeholder: "X5" },
        { name: "y1", placeholder: "Y1" },
        { name: "y2", placeholder: "Y2" },
        { name: "y3", placeholder: "Y3" },
        { name: "y4", placeholder: "Y4" },
        { name: "y5", placeholder: "Y5" },
        { name: "color", placeholder: "Color" }
      ]
    };

    const optionFields = optionData[option];
    optionFields.forEach((field, index) => {
      fields.push(
        <div key={index}>
          <h4>{field.placeholder}</h4>
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        </div>
      );
    });
    return fields;
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="option">Select Number of Buttons:</label>
        <select id="option" value={option} onChange={handleChange}>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        {renderFormFields()}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
