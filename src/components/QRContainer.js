import React, { useEffect } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from './Forms';


const QRContainer = ({qrRefs, zippingFiles, setZippingFiles, items, generating, setGenerating}) => {
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
                saveAs(content, 'qrcodes.zip');
                setZippingFiles(false);
            })})
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


    return (
        <div>
            <div id='qr-container' className='lg:w-[100%] h-[400px] border overflow-y-auto mb-3'>
                    
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
                        <p className={'inline-block font-semibold text-primary mr-3'}>Zipping Files</p>
                        <img src={require('../img/loading.gif')} className='inline-block w-5 h-5'/>
                    </div>
                    }
                    <Button className={'bg-accent text-white'} onClick={downloadZip}>Save as ZIP</Button>
                </div>
            }
        </div>
    )
          
}

export default QRContainer;