const loading = require('assets/loading2.gif');
import Image from 'next/image'

export default function LoadingPanel() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            // backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            zIndex: 100,
            height: '100%',
            border: '1px solid black',
            opacity: 0.7,

        }}>
            <Image style={{ zIndex: 101 }}
                src={loading} alt="Loading" width={100} height={100}
            />
        </div>
    )
};