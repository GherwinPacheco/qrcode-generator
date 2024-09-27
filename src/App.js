import './App.css';
import React, {useState, useEffect, useRef} from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {HText, PText} from './components/ResponsiveText';
import {Input, Button, Label, Select, Checkbox} from './components/Forms';

function App() {
  const [generating, setGenerating] = useState(false);
  const [zippingFiles, setZippingFiles] = useState(false);

  const [mode, setMode] = useState('single');
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    word: '',
    first: '',
    last: '',
  });
  const qrRefs = useRef([]);

  const addQrRef = (el) => {
    if(el && !qrRefs.current.includes(el)){
      qrRefs.current.push(el);
    }
  }


  


  const downloadQr = (index, item) => {
    const canvas = qrRefs.current[index];
    console.log(canvas)
    const imageData = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `${item}.png`;
    link.click();
  }

  const downloadZip = () => {
    setZippingFiles(true);
    const zip = new JSZip();

    const convertToBlob = (canvas) => {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to Blob'));
          }
        }, 'image/png');
      });
    };
    
    // Create an array of promises for converting canvases to blobs
    const blobPromises = items.map((item, index) => {
      const canvas = qrRefs.current[index];
      return convertToBlob(canvas)
        .then((blob) => {
          zip.file(`${item}.png`, blob); // Add the blob to the zip file
        })
        .catch((error) => {
          console.log(`Error converting canvas ${index}:`, error);
        });
    });

    // Wait for all blobs to be processed
    Promise.all(blobPromises)
      .then(() => {
        zip.generateAsync({type:"blob"}).then(function(content) {
          // see FileSaver.js
          saveAs(content, "example.zip");
          setZippingFiles(false);
        });
        
      })
      .catch((error) => {
          console.error('Error generating zip file:', error);
          setZippingFiles(false);
      });
      
  };

  


  useEffect(() => {
    const processItem = async (index) => {  //
      if (index >= items.length) {// Exit when all items are processed
        setGenerating(false); 
        return;
      }
      
      const canvas = qrRefs.current[index];
      QRCode.toCanvas(canvas, items[index], function (error) {
        if (error) console.error(error);

        console.log('success!');
        // Process the next item after a short delay
        setTimeout(() => processItem(index + 1), 0);
      });
      
    };

    processItem(0); // Start processing from the first item
    
  }, [items]);


  const generateQr = (event) => {
    event.preventDefault();
    setGenerating(true);
    const codesArray = [];

    if(mode === 'single'){
      codesArray.push(formData.word);
    } 
    else{
      const firstNum = parseInt(formData.first);
      const lastNum = parseInt(formData.last);

      for(let i = firstNum; i <= lastNum; i++){
        let numLength = formData.last.length;//get the no of digits of the last number
        let zeroCount = numLength - i.toString().length; //get the amout of zeros that should be added
        let num = '0'.repeat(zeroCount) + i;  //add the zeros

        
        let code = `${formData.word && formData.word + '-'}${num}`;
        
        codesArray.push(code);
      }
    }
    

    setItems(codesArray);
    setFormData({word: '', first: '', last: ''});
  }

  
  
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value});
  }



  const handleChangeMode = (event) => {
    setMode(event.target.value);
    setFormData({
      word: '',
      first: '',
      lase: ''
    });
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col bg-background">
      <div className='grid grid-cols-1 md:grid-cols-2 bg-white rounded-md shadow-lg p-10 m-6'>
        <div className='col-span-1 relative mb-4'>

          <form action='#' method='post' onSubmit={generateQr}>
            <HText className='mb-3'>QR ID Generator</HText>

            <div className={'w-[50%] pr-3 mb-4'}>
              <Label htmlFor='mode'>Mode</Label>
              <Select id='mode' onChange={handleChangeMode}>
                <option value='single'>Generate Single Text</option>
                <option value='multiple'>Generate Multiple IDs</option>
              </Select>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2'>

              <div className='mb-4 col-span-1'>
                <Label htmlFor="word">{mode === 'single' ? 'Text' : 'Prefix'}</Label>
                <Input type="text" id="word" name='word' value={formData.word || ''} onChange={handleFormChange} placeholder='Keyword' required={mode === 'single'}/>
              </div>
              <div className='mb-4 col-span-1'></div>

              <div className={`mb-4 col-span-1 ${mode === 'single' && 'hidden'}`}>
                <Label htmlFor="first">First Number <span className='text-red-600'>*</span></Label>
                <Input type="number" id="first" name='first' value={formData.first || ''} onChange={handleFormChange} placeholder='0' min={1} required={mode === 'multiple'} />
              </div>
              
              <div className={`mb-4 col-span-1 ${mode === 'single' && 'hidden'}`}>
                <Label htmlFor="last">Last Number <span className='text-red-600'>*</span></Label>
                <Input type="number" id="last" name='last' value={formData.last || ''} onChange={handleFormChange} placeholder='0' min={1} required={mode === 'multiple'} />
              </div>

            </div>
            

            <Button className='bg-accent text-white' disabled={generating}>Generate</Button>
            { generating && 
              <div className='inline-block ml-5'>
                <PText className={'inline-block font-semibold text-primary mr-3'}>Generating</PText>
                <img src={require('./img/loading.gif')} className='inline-block w-5 h-5'/>
              </div>
            }
          </form>
          
        </div>


        <div className='col-span-1'>
          <div id='qr-container' className='w-[500px] h-[400px] border overflow-y-auto mb-3'>
            
            {items.map((item, index) => {
                return (
                  <div className='flex items-center border-b' key={index}>
                    <canvas ref={addQrRef} />
                    <div>
                      <p className='font-semibold mb-2 text-primary'>{item}</p>
                      <Button className={''} onClick={() => downloadQr(index, item)}>Download</Button>
                    </div>
                  </div>
                )
            })}
          </div>

          

          {(items.length > 1 && !generating) &&
          <div className='flex justify-end items-center'>
            { zippingFiles && 
              <div className='inline-block mr-5'>
                <PText className={'inline-block font-semibold text-primary mr-3'}>Zipping Files</PText>
                <img src={require('./img/loading.gif')} className='inline-block w-5 h-5'/>
              </div>
            }
            <Button className={'bg-accent text-white'} onClick={downloadZip}>Save as ZIP</Button>
          </div>
          }
          
        </div>
        
      </div>
    </div>
  );
}

export default App;
