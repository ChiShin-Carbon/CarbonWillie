import React, { useState } from 'react';
import Robot from '../../聊天機器人/robot'

const FormControl = () => {

  const handleDownload = async () => {
    const response = await fetch("http://localhost:8000/download-docx/");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <button onClick={handleDownload}>123</button>
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />

      我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />
      我是蔡沂庭<br />


      <Robot />



    </div>

  );
};

export default FormControl;
