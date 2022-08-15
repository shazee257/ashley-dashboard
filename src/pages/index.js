import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from 'styles/Home.module.css';

const Home = () => {
    const router = useRouter();
    useEffect(() => {
        // if (router.pathname == '/') {
        router.push('/login');
        // }
    }, []);


    // redirect to login page
    // useEffect(() => {
    //     window.location.href = `${process.env.NEXT}/login`;
    // }, []);
    // return (
    //     <div className={styles.main}>
    //         <h2 className={styles.productTitle}>Dashboard Section</h2>
    //         {/* <Link href="/newcourse">
    //             <Button variant="contained" color="primary" hidden component="label" >Create New</Button>
    //         </Link> */}
    //     </div >
    // )
}

export default Home;