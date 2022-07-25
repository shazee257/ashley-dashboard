import moment from 'moment';

export const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
}

export const formatDateOnlyTime = (date) => {
    return moment(date).format("hh:mm a");
}

export const formatDateTime = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm a");
}

// image source for user image update endpoint
export const imageSource = (image, img_address, img) => {
    if (image && !img_address) {
        console.log("image && !img_address");
        return `${process.env.NEXT_PUBLIC_uploadURL}/${img}`;
    }
    else if (img_address) {
        console.log("img_address");
        return img_address;
    }
    else if (image == "" && !img_address) {
        console.log(`image == "" && !img_address`);
        return `${process.env.NEXT_PUBLIC_uploadURL}/avatar.png`;
    }
}