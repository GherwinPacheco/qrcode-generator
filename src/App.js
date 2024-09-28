import './App.css';
import React, {useState, useRef} from 'react';
import QRForm from './components/QRForm';
import QRContainer from './components/QRContainer';

function App() {
  const [generating, setGenerating] = useState(false);
  const [zippingFiles, setZippingFiles] = useState(false);

  const [mode, setMode] = useState('text');
  const [items, setItems] = useState([]);
  
  const qrRefs = useRef([]);
  

  return (
    <div className="h-screen block lg:flex lg:justify-center lg:items-center flex-col bg-background p-3">
      <div className='grid grid-cols-1 lg:grid-cols-2 bg-white rounded-md shadow-lg p-10 w-[100%] lg:w-[80%]'>
        <div className='col-span-1 pr-3'>
          <QRForm 
            className='mb-4'
            mode={mode} 
            setMode={setMode} 
            setItems={setItems} 
            generating={generating} 
            setGenerating={setGenerating}
          />
        </div>


        <div className='col-span-1'>
          <QRContainer 
            qrRefs={qrRefs}
            zippingFiles={zippingFiles}
            setZippingFiles={setZippingFiles}
            items={items}
            generating={generating}
            setGenerating={setGenerating}
          />
        </div>
        
      </div>
    </div>
  );
}

export default App;
