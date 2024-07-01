import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
    return (
        <div className=' flex justify-center items-center h-screen'>
            <CircularProgress color="primary" className=' text-green' />
        </div>
    );
}
