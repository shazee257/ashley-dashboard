import styles from 'styles/Sliders.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Modal = ({ src, alt, caption, onClose }) => {
    return (
        <div className={styles.modal}>
            <span className={styles.close} onClick={onClose}>
                &times;
            </span>
            <img className={`${styles}.modal-content`} src={src} alt={alt} />
            {caption.length > 0 && <div className={styles.caption}>{caption}</div>}
        </div>
    )
}

export default function Customers({ sliders }) {
    const [data, setData] = useState(sliders);
    const [isOpen, setIsOpen] = useState(false)
    const showModal = () => setIsOpen(true)
    const [slider, setSlider] = useState();


    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(sliders.filter((item) => item._id !== id));
    }

    // open image in new tab
    // const imageHandler = (image) => {
    //     window.open(`${process.env.NEXT_PUBLIC_uploadURL}/slider/${image}`, '_blank');
    // }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Title", width: 260,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_thumbURL}/slider/${params.row.image}`}
                                onClick={() => { showModal(); setSlider(params.row) }}

                            // onClick={() => imageHandler(params.row.image)}
                            />
                        </div>
                        {params.row.title}
                    </>
                );
            },
        },
        { field: "sub_title", headerName: "Sub-Title", width: 230 },
        { field: "description", headerName: "Description", width: 230 },
        {
            field: "createdAt", headerName: "Created on", width: 150, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/sliders/update/" + params.row.id}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Slider Content</h2>
                <Link href="/sliders/create">
                    <Button variant="contained" color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />

            <div className={styles.App}>
                {isOpen &&
                    (<Modal
                        src={`${process.env.NEXT_PUBLIC_uploadURL}/slider/${slider.image}`}
                        alt={slider.title}
                        caption={slider.title}
                        onClose={() => setIsOpen(false)}
                    />)}
            </div>


        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/sliders`);
    return {
        props: {
            sliders: data.sliders,
        },
    };
}