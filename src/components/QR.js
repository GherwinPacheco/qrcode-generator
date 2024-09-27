import {QRCodeSVG} from 'qrcode.react';

const QR = ({includeText = false, value, ...rest}) => {
    return(
        <div className='inline-block p-3'>
            <QRCodeSVG value={value} size={100} {...rest}/>
            {includeText && <h6 className='font-semibold text-center'>{value}</h6>}
        </div>
    );
}

export default QR;