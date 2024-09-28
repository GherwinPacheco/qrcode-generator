import React, {useState} from 'react';
import {HText, PText} from './ResponsiveText';
import {Input, TextArea, Button, Label, Select} from './Forms';


const QRForm = ({className, mode, setMode, setItems, generating, setGenerating}) => {
    const [formData, setFormData] = useState({
        word: '',
        first: '',
        last: '',
    });
    const [minInput, setMinInput] = useState(1);


    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData =>{
            const newData = {...prevData, [name]: value}
            setMinInput(newData.first);

            return newData;
        });
        
    }

    const handleChangeMode = (event) => {
        setMode(event.target.value);
        setFormData({
            word: '',
            first: '',
            lase: ''
        });
        
    }

    const generateQr = (event) => {
        event.preventDefault();
        setGenerating(true);
        var codesArray = [];
    
        if(mode === 'text'){
            codesArray = formData.word.split('\n').filter(item => item.trim() !== "");
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
        
        if(codesArray.length <= 0){
            setGenerating(false);
            return;
            
        }
        
        
        setItems(codesArray);
            setFormData({word: '', first: '', last: ''});
        
        
    }
    
    return (
        <form action='#' method='post' className={className} onSubmit={generateQr}>
            <div className='flex items-center mb-3'>
                <img src={require('../img/logo.png')} className='w-10 h-10 mr-3'/>
                <HText>QRCode Generator</HText>
            </div>
            

            <div className={'w-[50%] pr-3 mb-4'}>
                <Label htmlFor='mode'>Mode</Label>
                <Select id='mode' onChange={handleChangeMode}>
                <option value='text'>Generate from Text</option>
                <option value='range'>Generate with range</option>
                </Select>
            </div>
            
            <div className='grid grid-cols-2'>

                
                <div className='mb-4 col-span-2'>
                    <Label htmlFor="word">{mode === 'text' ? 'Text' : 'Prefix'}</Label>
                    {
                        mode === 'text' ? 
                        <TextArea rows={8} id="word" name='word' value={formData.word || ''} onChange={handleFormChange} placeholder='Enter multiple lines of text' required={mode === 'text'}/> :
                        <Input type="text" id="word" name='word' value={formData.word || ''} onChange={handleFormChange} placeholder='Keyword' required={mode === 'range'}/>
                    }
                    
                    
                </div>

                <div className={`mb-4 col-span-1 ${mode === 'text' && 'hidden'}`}>
                    <Label htmlFor="first">First Number <span className='text-red-600'>*</span></Label>
                    <Input className={'w-full lg:w-auto'} type="number" id="first" name='first' value={formData.first || ''} onChange={handleFormChange} placeholder='0' min={1} required={mode === 'range'} />
                </div>
                
                <div className={`mb-4 col-span-1 ${mode === 'text' && 'hidden'}`}>
                    <Label htmlFor="last">Last Number <span className='text-red-600'>*</span></Label>
                    <Input className={'w-full lg:w-auto'} type="number" id="last" name='last' value={formData.last || ''} onChange={handleFormChange} min={minInput} placeholder={minInput} required={mode === 'range'} />
                </div>

            </div>
            

            <Button className='bg-accent text-white mt-1' disabled={generating}>Generate</Button>
            { generating && 
                <div className='inline-block ml-5'>
                <PText className={'inline-block font-semibold text-primary mr-3'}>Generating</PText>
                <img src={require('../img/loading.gif')} className='inline-block w-5 h-5'/>
                </div>
            }
        </form>
    )
}

export default QRForm;